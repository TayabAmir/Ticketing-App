import React, { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'

const OrderDetails = ({ currentUser, order }) => {

    const [timer, setTimer] = useState(0)
    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: 'post',
        body: { orderId: order.id },
        onSuccess: (order) => Router.push('/orders')
    })

    useEffect(() => {
        const timeLeft = () => setTimer(Math.Round((new Date(order.expiresAt) - new Date()) / 1000));
        timeLeft()
        const timerId = setInterval(timeLeft, 1000);
        return () => {
            clearInterval(timerId)
        }
    }, [])

    if (timeLeft < 0) {
        return <div>Order Expired!</div>
    }

    return (
        <div>
            Time left to pay: {timer}
            <StripeCheckout
                token={(token) => doRequest(token.id)}
                stripeKey='pk_test_51PVTgj2M5k6SC5exsy0Gwe0sZ6n0SyFluZMtWEEIuBm6veTutZ0lTw152jV2HE6B9RuJXUiMZDvPkS1hGIY61AlA00NdUTwiJ8'
                amount={order.ticket.price}
                email={currentUser.email}
            />
        </div>
    )
}

OrderDetails.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
}

export default OrderDetails