import {useEffect, useState} from 'react';
import axios from 'axios';

const InterceptorError = ({ children }) => {

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {

                if (error.response && error.response.status === 401) {
                    localStorage.clear();

                    window.dispatchEvent(new Event('expiredSession'));
                }
                return Promise.reject(error);
            }
        );

        setIsReady(true);

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    if(!isReady) {
        return null;
    }

    return children;
};

export default InterceptorError;