import api from "@/lib/axios";



export const signup = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string
}) => {
    try {
        const response = await api.post('/api/auth/signup', data)
        console.log("hai", response)
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

        const response = await api.post('/api/auth/verify-otp', data)
        console.log(response.data)
        return response.data

    } catch (error) {

        throw error

    }
}

export const verifyForgotOTP = async (data: {
    email: string,
    otp: Number

}) => {
    try {

        const response = await api.post('/api/auth/verifyForgot-otp', data)
        console.log(response.data)
        return response.data

    } catch (error) {

        throw error

    }
}

export const login = async (data: {
    email: string,
    password: string
}) => {
    try {

        const response = await api.post('/api/auth/login', data, {
            withCredentials: true
        });


        return response.data

    } catch (error) {
        throw error
    }
}

export const refreshToken = async () => {
    try {

        const response = await api.post('/api/auth/refresh', {}, {
            withCredentials: true
        })


        return response.data

    } catch (error) {
        throw error
    }
}

export const resendOTP = async (token: string) => {
    try {

        const response = await api.post("/api/auth/resend-otp", { token })
        return response

    } catch (error) {
        throw error
    }
}

export const resendForgotOTP = async (email: string) => {
    try {

        const response = await api.post("/api/auth/resendForgot-otp", { email })
        return response

    } catch (error) {
        throw error
    }
}


export const forgotPassword = async (email: string) => {
    try {

        const response = await api.post("/api/auth/forgot-password", { email })
        return response

    } catch (error) {
        throw error
    }

    }

 export const resetPassword = async (data:{
    email : string
    newPassword : string,
    confirmPassword : string
 })  =>{

    try {

        const response = await api.post("/api/auth/reset-password",data)
        return response.data
        
    } catch (error) {

        throw error
        
    }

 }

