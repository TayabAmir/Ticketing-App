import 'bootstrap/dist/css/bootstrap.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import buildClient from "../api/build-client"
import Header from '../components/header';

const App = ({ Component, pageProps, currentUser }) => {
    return <div>
        <Header currentUser={currentUser} />
        <div className='container'>
            <Component currentUser={currentUser} {...pageProps} />
        </div>
        <ToastContainer />
    </div>
}

App.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};
    if (appContext.Component?.getInitialProps)
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser)
    return {
        pageProps,
        ...data
    };
}
export default App;