import { AppError } from '../lib/errors.js';

export async function listFarms(req, res, next) {
  try {
    const { data: farms, error } = await req.db
      .from('farms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: farms });
  } catch (err) {
    next(err);
  }
}

export async function createFarm(req, res, next) {
  try {
    const farmData = {
      ...req.body,
      user_id: req.user.id,
    };

    const { data: farm, error } = await req.db
      .from('farms')
      .insert(farmData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data: farm });
  } catch (err) {
    next(err);
  }
}

export async function getFarm(req, res, next) {
  try {
    const { id } = req.params;

    const { data: farm, error } = await req.db
      .from('farms')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !farm) {
      throw new AppError('NOT_FOUND', 'Farm not found', 404);
    }

    res.json({ success: true, data: farm });
  } catch (err) {
    next(err);
  }
}

export async function updateFarm(req, res, next) {
  try {
    const { id } = req.params;

    const { data: farm, error } = await req.db
      .from('farms')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error || !farm) {
      throw new AppError('NOT_FOUND', 'Farm not found or update unauthorized', 404);
    }

    res.json({ success: true, data: farm });
  } catch (err) {
    next(err);
  }
}

export async function deleteFarm(req, res, next) {
  try {
    const { id } = req.params;

    const { error, count } = await req.db
      .from('farms')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error || count === 0) {
      throw new AppError('NOT_FOUND', 'Farm not found or delete unauthorized', 404);
    }

    res.json({ success: true, data: { id, message: 'Farm deleted successfully' } });
  } catch (err) {
    next(err);
  }
}
