import request from "supertest";
import { app } from "../../app";

it('Fails when the email given does not exist', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({ email: "test@test.com", password: "password" })
        .expect(400)
})

it('Fails when password given is wrong', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({ email: "test@test.com", password: "password" })
        .expect(201)

    await request(app)
        .post('/api/users/signin')
        .send({ email: "test@test.com", password: "passwork" })
        .expect(400)
})

it('Returns cookie on successful signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({ email: "test@test.com", password: "password" })
        .expect(201)

    const res= await request(app)
        .post('/api/users/signin')
        .send({ email: "test@test.com", password: "password" })
        .expect(200)    
    expect(res.get('Set-Cookie')).toBeDefined();
})
