import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose";
import { create } from "./index.test";

it("returns a 404 if the Ticket with id isn't found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app).put(`/api/tickets/${id}`).set('Cookie', global.signup()).send({
        title: "Hello",
        price: 12
    }).expect(404)
})
it("returns a 401 if the user not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app).put(`/api/tickets/${id}`).send({
        title: "Hello",
        price: 12
    }).expect(401)
})
it("returns a 401 if the user is not the owner of the ticket", async () => {
    const res = await request(app).post(`/api/tickets`).set('Cookie', global.signup()).send({
        title: 'Movie',
        price: 1000
    })
    await request(app).put(`/api/tickets/${res.body.id}`).set('Cookie', global.signup()).send({
        title: 'sadas',
        price: 23
    }).expect(401)
})
it("returns a 400 if invalid title or price is provided", async () => {
    const cookie = global.signup()
    const res = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
        title: 'Movie',
        price: 1000
    })
    await request(app).put(`/api/tickets/${res.body.id}`).set('Cookie', cookie).send({
        title: 'Movie',
        price: -1
    }).expect(400)
    await request(app).put(`/api/tickets/${res.body.id}`).set('Cookie', cookie).send({
        title: '',
        price: 1
    }).expect(400)
})
it("returns a 200 if valid title and price is provided", async () => {
    const cookie = global.signup()
    const res = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
        title: 'Movie',
        price: 1000
    })
    await request(app).put(`/api/tickets/${res.body.id}`).set('Cookie', cookie).send({
        title: 'Movie',
        price: 50000
    }).expect(200)
})
