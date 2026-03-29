import request from 'supertest';
import { Server } from 'http';
import app from '../app';

let server: Server;
let token: string;

beforeAll(async () => {
  server = app.listen(0);

  const email = `test${Date.now()}@email.com`;
  await request(server)
    .post('/auth/register')
    .send({ email, password: '123456' });
  const res = await request(server)
    .post('/auth/login')
    .send({ email, password: '123456' });
  token = res.body.token;
});

afterAll((done) => {
  server.close(done);
});

describe('Link routes', () => {
  describe('POST /links', () => {
    it('should be create a new link', async () => {
      const res = await request(server)
        .post('/links')
        .set('Authorization', `Bearer ${token}`)
        .send({ url: 'https://github.com', title: 'GitHub' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.url).toBe('https://github.com');
    });

    it('should be return a 401 code, without token', async () => {
      const res = await request(server)
        .post('/links')
        .send({ url: 'https://github.com', title: 'GitHub' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /links', () => {
    it('should be a return a list link for user', async () => {
      const res = await request(server)
        .get('/links')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should be return a 401 code, without token', async () => {
      const res = await request(server).get('/links');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /links/:id', () => {
    it('should be update a exist link', async () => {
      const created = await request(server)
        .post('/links')
        .set('Authorization', `Bearer ${token}`)
        .send({ url: 'https://github.com', title: 'GitHub' });

      const res = await request(server)
        .put(`/links/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'GitHub atualizado' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('GitHub atualizado');
    });

    it('should be return a 401 code, without token', async () => {
      const created = await request(server)
        .post('/links')
        .set('Authorization', `Bearer ${token}`)
        .send({ url: 'https://github.com', title: 'GitHub' });

      const res = await request(server)
        .put(`/links/${created.body.id}`)
        .send({ title: 'GitHub atualizado' });

      expect(res.status).toBe(401);
    });

    it('should be return 404 error for non-exist link', async () => {
      const res = await request(server)
        .put('/links/id-inexistente')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'teste' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /links/:id', () => {
    it('should be delete a exist link', async () => {
      const created = await request(server)
        .post('/links')
        .set('Authorization', `Bearer ${token}`)
        .send({ url: 'https://github.com', title: 'GitHub' });

      const res = await request(server)
        .delete(`/links/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it('should be return a 401 code, without token', async () => {
      const created = await request(server)
        .post('/links')
        .set('Authorization', `Bearer ${token}`)
        .send({ url: 'https://github.com', title: 'GitHub' });

      const res = await request(server).delete(`/links/${created.body.id}`);

      expect(res.status).toBe(401);
    });

    it('should be return 404 error for non-exist link', async () => {
      const res = await request(server)
        .delete('/links/id-inexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
