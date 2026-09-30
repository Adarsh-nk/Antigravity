export async function getDashboardSummary(req, res, next) {
  try {
    const { count: farmCount, error: farmErr } = await req.db
      .from('farms')
      .select('*', { count: 'exact', head: true });

    if (farmErr) throw farmErr;

    const { count: advisoryCount, error: advErr } = await req.db
      .from('advisories')
      .select('*', { count: 'exact', head: true });

    if (advErr) throw advErr;

    const { data: recentAdvisories, error: recentErr } = await req.db
      .from('advisories')
      .select('id, farm_id, advisory_type, language, title, confidence, escalate_to_expert, image_path, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentErr) throw recentErr;

    res.json({
      success: true,
      data: {
        farmCount: farmCount || 0,
        advisoryCount: advisoryCount || 0,
        recentAdvisories: recentAdvisories || [],
      },
    });
  } catch (err) {
    next(err);
  }
}
