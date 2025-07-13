import request from "supertest";
import { app } from "../../app";

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({ email: "test@test.com", password: "password" })
        .expect(201)
})

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({ email: "testas", password: "password" })
        .expect(400)
})

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({ email: "test@test.com", password: "pa" })
        .expect(400)
})
it('returns a 400 with missing credentials', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})
it('Disallows a duplicate email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({ email: "test@test.com", password: "password" })
        .expect(201)

    await request(app)
        .post('/api/users/signup')
        .send({ email: "test@test.com", password: "password" })
        .expect(400)
})
it('Setting up a cookie after signup', async () => {
    const res = await request(app)
        .post('/api/users/signup')
        .send({ email: "test@test.com", password: "password" })
        .expect(201)
    expect(res.get('Set-Cookie')).toBeDefined();
})