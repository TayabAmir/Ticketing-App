import request from "supertest"
import { app } from "../../app"

export const create = () => {
    return request(app).post('/api/tickets').set('Cookie', global.signup()).send({
        title: 'Movie',
        price: 5000
    }).expect(201)
}

it("returns all the tickets ", async () => {
    await create()
    await create()
    await create()
    await create()
    const res = await request(app).get('/api/tickets').send().expect(200)
    expect(res.body.length).toEqual(4)
})