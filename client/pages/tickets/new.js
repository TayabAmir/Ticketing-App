import React, { useState } from 'react'
import useRequest from "../../hooks/use-request"
import Router from "next/Router"


const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const { doRequest, errors } = useRequest({
        url: "/api/tickets",
        method: 'post',
        body: { title, price },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = (e) => {
        e.preventDefault();
        console.log({ title, price });
        doRequest()
    };
    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Price</label>
                <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                    type="number"
                />
            </div>

            <button className="btn btn-primary" type="submit">
                Submit
            </button>
        </form>
    )
}

export default NewTicket