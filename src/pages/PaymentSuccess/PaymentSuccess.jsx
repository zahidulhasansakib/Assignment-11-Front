import React, { useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

import useAxios from '../../hooks/useAxios';


 

const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const axiosInstance = useAxios();
    useEffect(() => {
      axiosInstance.post(`/success-payment?session_id=${sessionId}`)
      .then(res=>{
        console.log(res.data);
        
      })
    }, [axiosInstance, sessionId]);
    return (
        <div>
            Payment Success
        </div>
    );
};

export default PaymentSuccess;