import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../model/tickets";

jest.mock('../../nats-wrapper.ts')

it("There exist a route handler for /api/tickets of post request", async () => {
    const response = await request(app).post('/api/tickets').send({})
    expect(response.status).not.toEqual(404);
})
it("Only authenticated user can access this", async () => {
    await request(app).post('/api/tickets').set('Cookie', global.signup()).send({}).expect(400)
})
it("An error for invalid title", async () => {
    await request(app).post('/api/tickets').set('Cookie', global.signup()).send({
        title: '',
        price: 10
    }).expect(400)
})
it("An error for invalid price", async () => {
    await request(app).post('/api/tickets').set('Cookie', global.signup()).send({
        title: 'Movie',
        price: -1
    }).expect(400)
})
it("Creates a ticket for authenticated user and valid inputs", async () => {
    let docs = await Ticket.countDocuments()
    expect(docs).toEqual(0);
    await request(app).post('/api/tickets').set('Cookie', global.signup()).send({
        title: 'Movie',
        price: 5000
    }).expect(201)
    docs = await Ticket.countDocuments()
    expect(docs).toEqual(1)
})