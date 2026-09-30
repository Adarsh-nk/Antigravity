import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';

const FARM_B_UUID = '123e4567-e89b-12d3-a456-426614174000';

// Mock Supabase client creation
vi.mock('../lib/supabase.js', async () => {
  const actual = await vi.importActual('../lib/supabase.js');

  return {
    ...actual,
    createAnonClient: () => ({
      auth: {
        getUser: async (token) => {
          if (token === 'user-a-token') {
            return { data: { user: { id: 'user-a-id' } }, error: null };
          }
          if (token === 'user-b-token') {
            return { data: { user: { id: 'user-b-id' } }, error: null };
          }
          return { data: { user: null }, error: new Error('Invalid token') };
        },
      },
    }),
    createUserClient: (token) => {
      const currentUserId = token === 'user-a-token' ? 'user-a-id' : 'user-b-id';

      // Mock database store simulating RLS
      const farmsStore = [
        { id: FARM_B_UUID, user_id: 'user-b-id', name: 'User B Farm' },
      ];

      return {
        from: (table) => {
          if (table === 'api_usage_logs') {
            return {
              insert: () => Promise.resolve({ error: null }),
            };
          }

          return {
            select: () => ({
              eq: (col, val) => ({
                single: async () => {
                  const found = farmsStore.find((f) => f.id === val && f.user_id === currentUserId);
                  if (!found) return { data: null, error: { code: 'PGRST116' } };
                  return { data: found, error: null };
                },
              }),
            }),
            update: () => ({
              eq: (col, val) => ({
                select: () => ({
                  single: async () => {
                    const found = farmsStore.find((f) => f.id === val && f.user_id === currentUserId);
                    if (!found) return { data: null, error: { code: 'PGRST116' } };
                    return { data: found, error: null };
                  },
                }),
              }),
            }),
            delete: (opts) => ({
              eq: async (col, val) => {
                const found = farmsStore.find((f) => f.id === val && f.user_id === currentUserId);
                return { error: null, count: found ? 1 : 0 };
              },
            }),
          };
        },
      };
    },
  };
});

describe('Data Isolation Rules (User A vs User B)', () => {
  it("prevents User A from reading User B's farm (returns 404)", async () => {
    const res = await request(app)
      .get(`/api/farms/${FARM_B_UUID}`)
      .set('Authorization', 'Bearer user-a-token');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it("prevents User A from updating User B's farm (returns 404)", async () => {
    const res = await request(app)
      .put(`/api/farms/${FARM_B_UUID}`)
      .set('Authorization', 'Bearer user-a-token')
      .send({
        name: 'Hacked Farm Name',
        area: 10,
        area_unit: 'acre',
        state: 'Maharashtra',
        district: 'Nashik',
        soil_type: 'black_cotton_regur',
        irrigation_source: 'canal',
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("prevents User A from deleting User B's farm (returns 404)", async () => {
    const res = await request(app)
      .delete(`/api/farms/${FARM_B_UUID}`)
      .set('Authorization', 'Bearer user-a-token');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
