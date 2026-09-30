import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Auth Middleware Integration', () => {
  it('rejects unauthenticated requests to protected endpoints', async () => {
    const res = await request(app).get('/api/farms');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects malformed authorization header', async () => {
    const res = await request(app)
      .get('/api/farms')
      .set('Authorization', 'InvalidTokenStructure');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('allows public health endpoint without authentication', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('allows public metadata endpoint without authentication', async () => {
    const res = await request(app).get('/api/meta/options');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.seasons).toBeDefined();
  });
});
