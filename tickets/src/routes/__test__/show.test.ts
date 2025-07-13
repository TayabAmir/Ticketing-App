import request from "supertest"
import { app } from "../../app"

it("returns a 404 if the Ticket with id isn't found", async () => {
    const response = await request(app).get('/api/tickets/askjaskjsakj').send().expect(404)
})
it("returns a ticket if the Ticket is found", async () => {
    const title = 'Movie';
    const price = 5000;
    const res = await request(app).post('/api/tickets').set('Cookie', global.signup()).send({
        title, price
    }).expect(201)
    const ticketResponse = await request(app).get(`/api/tickets/${res.body.id}`).send().expect(200)
    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
})