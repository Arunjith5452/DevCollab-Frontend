import axios from "axios";


const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export const signup = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string
}) => {
    try {
        const response = await apiClient.post('/api/auth/signup', data)
        console.log(response)
        return response.data
    } catch (error) {
        throw error
    }
}


export const verifyOTP = async (data: {
    token: string,
    otp: Number

}) => {
    try {

        const response = await apiClient.post('/api/auth/verify-otp',data)
        console.log(response.data)
        return response.data

    } catch (error) {

        throw error

    }
}