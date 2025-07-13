import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest } = useRequest({
        url: "/api/users/signin",
        method: "post",
        body: { email, password },
        onSuccess: ()=>Router.push('/')
    })
    const handleSubmit = async (e) => {
        e.preventDefault()
        await doRequest();
    }
    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign In Form</h1>
            <div>
                <label>Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className='form-control'></input>
            </div>
            <div>
                <label>Password</label>
                <input value={password} type='password' onChange={(e) => setPassword(e.target.value)} className='form-control'></input>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 10 }}>Sign In</button>
        </form>
    )
}

export default SignIn