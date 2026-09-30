import { AppError } from '../lib/errors.js';
import { generateText } from '../services/gemini.service.js';
import { buildChatContents } from '../prompts/chat.prompt.js';
import { LANGUAGE_NAMES } from '../config/domain.js';

export async function listMessages(req, res, next) {
  try {
    const { id: advisoryId } = req.params;

    const { data: messages, error } = await req.db
      .from('advisory_messages')
      .select('*')
      .eq('advisory_id', advisoryId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data: messages || [] });
  } catch (err) {
    next(err);
  }
}

export async function sendChatMessage(req, res, next) {
  try {
    const { id: advisoryId } = req.params;
    const { message } = req.body;

    // Load advisory
    const { data: advisory, error: advErr } = await req.db
      .from('advisories')
      .select('*')
      .eq('id', advisoryId)
      .single();

    if (advErr || !advisory) {
      throw new AppError('NOT_FOUND', 'Advisory not found', 404);
    }

    // Load farm if present
    let farm = advisory.farm_snapshot;
    if (advisory.farm_id) {
      const { data: farmRow } = await req.db
        .from('farms')
        .select('*')
        .eq('id', advisory.farm_id)
        .single();
      if (farmRow) farm = farmRow;
    }

    // Load existing messages
    const { data: messages } = await req.db
      .from('advisory_messages')
      .select('*')
      .eq('advisory_id', advisoryId)
      .order('created_at', { ascending: true });

    const languageName = LANGUAGE_NAMES[advisory.language] || 'English';

    const { systemInstruction, contents } = buildChatContents({
      advisory,
      farm,
      messages: messages || [],
      newMessage: message,
      languageName,
    });

    let assistantReply;
    try {
      assistantReply = await generateText({
        systemInstruction,
        contents,
      });
    } catch (err) {
      if (err.code === 'AI_TIMEOUT') {
        throw new AppError('AI_TIMEOUT', 'Chat response timed out. Please try again.', 504);
      }
      throw new AppError('AI_UNAVAILABLE', 'AI service is temporarily unavailable. Please try again.', 502);
    }

    // Persist user message
    const { error: userMsgErr } = await req.db.from('advisory_messages').insert({
      advisory_id: advisoryId,
      user_id: req.user.id,
      role: 'user',
      content: message,
    });
    if (userMsgErr) throw userMsgErr;

    // Persist assistant message
    const { data: savedAssistantMsg, error: astMsgErr } = await req.db
      .from('advisory_messages')
      .insert({
        advisory_id: advisoryId,
        user_id: req.user.id,
        role: 'assistant',
        content: assistantReply,
      })
      .select()
      .single();

    if (astMsgErr) throw astMsgErr;

    res.status(201).json({ success: true, data: savedAssistantMsg });
  } catch (err) {
    next(err);
  }
}
