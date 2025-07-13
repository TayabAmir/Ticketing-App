import Link from "next/link"

const Home = ({ currentUser, tickets }) => {

    const list = tickets.map((ticket) => {
        return (
            <Link href="/tickets/[ticket.id]" as={`/tickets/${ticket.id}`}>
                <tr key={ticket.id}>
                    <td>{ticket.title}</td>
                    <td>{ticket.price}</td>
                </tr>
            </Link>
        )
    })

    return (
        <div>
            <div>
                <h1>Tickets</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </table>
            </div>
            {/* {
                currentUser ? (
                    <h1>Hello {currentUser.email.split('@')[0]}!</h1 >
                )
                    : (
                        <h1>You are not signed in</h1>
                    )
            } */}
        </div >
    )
}

Home.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets')
    return { tickets: data }
}
export default Home 