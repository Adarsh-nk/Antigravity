import { AppError } from '../lib/errors.js';
import { createAdminClient } from '../lib/supabase.js';
import { logger } from '../lib/logger.js';

export async function getProfile(req, res, next) {
  try {
    const { data: profile, error } = await req.db
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!profile) {
      // Fallback auto-create profile if trigger didn't fire
      const { data: newProfile, error: insertErr } = await req.db
        .from('profiles')
        .insert({
          id: req.user.id,
          full_name: req.user.user_metadata?.full_name || 'Farmer',
          preferred_language: req.user.user_metadata?.preferred_language || 'en',
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      return res.json({ success: true, data: newProfile });
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updates = req.body;

    const { data: profile, error } = await req.db
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function deleteProfile(req, res, next) {
  try {
    const userId = req.user.id;
    logger.info({ userId }, 'Initiating user account data deletion');

    // 1. List user images in storage and remove them
    const { data: files } = await req.db.storage.from('crop-images').list(userId);
    if (files && files.length > 0) {
      const filePaths = files.map((f) => `${userId}/${f.name}`);
      await req.db.storage.from('crop-images').remove(filePaths);
    }

    // 2. Delete profile row (FK cascade removes farms, advisories, messages, feedback)
    const { error: deleteProfileError } = await req.db
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (deleteProfileError) throw deleteProfileError;

    // 3. Delete Auth user using admin client
    const adminClient = createAdminClient();
    const { error: adminAuthError } = await adminClient.auth.admin.deleteUser(userId);

    if (adminAuthError) {
      logger.error({ err: adminAuthError, userId }, 'Failed to delete auth user via admin client');
    }

    res.json({
      success: true,
      data: { message: 'Account and associated data deleted successfully.' },
    });
  } catch (err) {
    next(err);
  }
}
