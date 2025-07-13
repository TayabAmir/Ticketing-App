import { Router } from "next/Router"
import useRequest from "../../hooks/use-request"
import React from 'react'

const TicketDetail = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: "/api/orders",
        method: 'post',
        body: { ticketId: ticket.id },
        onSuccess: (order) => Router.push('/orders/[orderId]',`/orders/${order.id}`)
    })

    // const onSubmit = (e) => {
    //     e.preventDefault();
    // }

    return (
        <div>
            <h1>{ticket.title}</h1>
            <h1>Price: {ticket.price}</h1>
            <button onClick={()=> doRequest()} className='btn btn-primary'>Purchase</button>
        </div>
    )
}

TicketDetail.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`)
    return { ticket: data }
}
export default TicketDetail