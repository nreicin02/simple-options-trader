import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../index';

describe('Health Check', () => {
  it('should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', message: 'SimpliOptions backend is healthy' });
  });
}); 