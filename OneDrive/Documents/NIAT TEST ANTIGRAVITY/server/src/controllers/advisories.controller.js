import { AppError } from '../lib/errors.js';
import { advisoryInputUnionSchema } from '../validators/advisoryInput.js';
import { generateAdvisoryPipeline } from '../services/advisory.service.js';
import { uploadCropImage, getSignedImageUrl, deleteCropImage } from '../services/storage.service.js';
import { env } from '../config/env.js';

export async function createAdvisory(req, res, next) {
  let uploadedImagePath = null;

  try {
    let payload;
    try {
      payload = typeof req.body.payload === 'string' ? JSON.parse(req.body.payload) : req.body.payload;
    } catch {
      throw new AppError('VALIDATION_ERROR', 'Invalid JSON payload in advisory request', 400);
    }

    const validatedInput = advisoryInputUnionSchema.parse(payload);

    // Reject image uploads for advisory types other than disease_diagnosis
    if (req.file && validatedInput.advisory_type !== 'disease_diagnosis') {
      throw new AppError('VALIDATION_ERROR', 'Images are only supported for Disease Diagnosis advisories', 400);
    }

    // Load farm details
    const { data: farm, error: farmErr } = await req.db
      .from('farms')
      .select('*')
      .eq('id', validatedInput.farm_id)
      .single();

    if (farmErr || !farm) {
      throw new AppError('NOT_FOUND', 'Selected farm was not found', 404);
    }

    const farmSnapshot = {
      name: farm.name,
      area: farm.area,
      area_unit: farm.area_unit,
      state: farm.state,
      district: farm.district,
      soil_type: farm.soil_type,
      irrigation_source: farm.irrigation_source,
      soil_ph: farm.soil_ph,
      soil_nitrogen_kg_ha: farm.soil_nitrogen_kg_ha,
      soil_phosphorus_kg_ha: farm.soil_phosphorus_kg_ha,
      soil_potassium_kg_ha: farm.soil_potassium_kg_ha,
      soil_organic_carbon_percent: farm.soil_organic_carbon_percent,
      soil_ec_ds_m: farm.soil_ec_ds_m,
    };

    let imagePart = null;
    if (req.file) {
      uploadedImagePath = await uploadCropImage(
        req.db,
        req.user.id,
        req.file.buffer,
        req.file.verifiedMimeType,
        req.file.verifiedExt
      );

      imagePart = {
        buffer: req.file.buffer,
        mimeType: req.file.verifiedMimeType,
      };
    }

    let result;
    try {
      result = await generateAdvisoryPipeline({
        advisoryType: validatedInput.advisory_type,
        inputPayload: validatedInput,
        farmSnapshot,
        language: validatedInput.language,
        imagePart,
      });
    } catch (genErr) {
      if (uploadedImagePath) {
        await deleteCropImage(req.db, uploadedImagePath);
      }
      throw genErr;
    }

    const advisoryRow = {
      user_id: req.user.id,
      farm_id: farm.id,
      advisory_type: validatedInput.advisory_type,
      language: validatedInput.language,
      title: result.title,
      input_payload: validatedInput,
      farm_snapshot: farmSnapshot,
      image_path: uploadedImagePath,
      output_payload: result.outputPayload,
      confidence: result.confidence,
      escalate_to_expert: result.escalateToExpert,
      model_name: env.GEMINI_MODEL,
      latency_ms: result.latencyMs,
      prompt_tokens: result.promptTokens,
      output_tokens: result.outputTokens,
    };

    const { data: savedAdvisory, error: saveErr } = await req.db
      .from('advisories')
      .insert(advisoryRow)
      .select()
      .single();

    if (saveErr) {
      if (uploadedImagePath) await deleteCropImage(req.db, uploadedImagePath);
      throw saveErr;
    }

    if (savedAdvisory.image_path) {
      savedAdvisory.signed_image_url = await getSignedImageUrl(req.db, savedAdvisory.image_path);
    }

    res.status(201).json({ success: true, data: savedAdvisory });
  } catch (err) {
    next(err);
  }
}

export async function listAdvisories(req, res, next) {
  try {
    const { type, q, page = 1, pageSize = 10 } = req.query;

    let query = req.db
      .from('advisories')
      .select('id, farm_id, advisory_type, language, title, confidence, escalate_to_expert, image_path, created_at', {
        count: 'exact',
      });

    if (type) {
      query = query.eq('advisory_type', type);
    }

    if (q) {
      query = query.ilike('title', `%${q}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: items, count, error } = await query.order('created_at', { ascending: false }).range(from, to);

    if (error) throw error;

    res.json({
      success: true,
      data: {
        items: items || [],
        total: count || 0,
        page: Number(page),
        pageSize: Number(pageSize),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdvisory(req, res, next) {
  try {
    const { id } = req.params;

    const { data: advisory, error } = await req.db
      .from('advisories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !advisory) {
      throw new AppError('NOT_FOUND', 'Advisory not found', 404);
    }

    if (advisory.image_path) {
      advisory.signed_image_url = await getSignedImageUrl(req.db, advisory.image_path);
    }

    res.json({ success: true, data: advisory });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdvisory(req, res, next) {
  try {
    const { id } = req.params;

    const { data: advisory, error: getErr } = await req.db
      .from('advisories')
      .select('id, image_path')
      .eq('id', id)
      .single();

    if (getErr || !advisory) {
      throw new AppError('NOT_FOUND', 'Advisory not found or delete unauthorized', 404);
    }

    if (advisory.image_path) {
      await deleteCropImage(req.db, advisory.image_path);
    }

    const { error: delErr } = await req.db
      .from('advisories')
      .delete()
      .eq('id', id);

    if (delErr) throw delErr;

    res.json({ success: true, data: { id, message: 'Advisory deleted successfully' } });
  } catch (err) {
    next(err);
  }
}

export async function submitFeedback(req, res, next) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const { data: feedback, error } = await req.db
      .from('advisory_feedback')
      .upsert(
        {
          advisory_id: id,
          user_id: req.user.id,
          rating,
          comment: comment || null,
        },
        { onConflict: 'advisory_id,user_id' }
      )
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: feedback });
  } catch (err) {
    next(err);
  }
}
