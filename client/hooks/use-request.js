import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null)

    const doRequest = async (props = {}) => {
        try {
            setErrors(null)
            const res = await axios[method](url, {
                ...props, ...body
            });
            if(onSuccess)
                onSuccess(res.data)
            return res.data
        } catch (error) {
            setErrors(error.response?.data?.errors)
            errors?.map((err) => toast.error(err.message))
        }
    }
    return { doRequest, errors };
}

export default useRequest