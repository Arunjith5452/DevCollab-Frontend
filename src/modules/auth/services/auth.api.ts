import api from "@/lib/axios";
import { AUTH_ROUTES } from "@/shared/constants/routes";



export const signup = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string
}) => {
    try {
        const response = await api.post(AUTH_ROUTES.SIGNUP, data)
        return response.data
    } catch (error) {
        throw error
    }
}


export const verifyOTP = async (data: {
    token: string,
    otp: number

}) => {
    try {

        const response = await api.post(AUTH_ROUTES.VERIFY_OTP, data)
        return response.data

    } catch (error) {

        throw error

    }
}

export const verifyForgotOTP = async (data: {
    email: string,
    otp: number

}) => {
    try {

        const response = await api.post(AUTH_ROUTES.VERIFY_FORGOT_OTP, data)
        return response.data

    } catch (error) {

        throw error

    }
}

export const login = async (data: {
    email: string,
    password: string,
}) => {
    try {

        const response = await api.post(AUTH_ROUTES.LOGIN, data, {
            withCredentials: true
        });

        return response.data

    } catch (error) {
        throw error
    }
}

export const refreshToken = async () => {
    try {

        const response = await api.post(AUTH_ROUTES.REFRESH_TOKEN, {}, {
            withCredentials: true
        })


        return response.data

    } catch (error) {
        throw error
    }
}

export const resendOTP = async (token: string) => {
    try {

        const response = await api.post(AUTH_ROUTES.RESEND_OTP, { token })
        return response

    } catch (error) {
        throw error
    }
}

export const resendForgotOTP = async (email: string) => {
    try {

        const response = await api.post(AUTH_ROUTES.RESEND_FORGOT_OTP, { email })
        return response

    } catch (error) {
        throw error
    }
}


export const forgotPassword = async (email: string) => {
    try {

        const response = await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email })
        return response

    } catch (error) {
        throw error
    }

}

export const resetPassword = async (data: {
    email: string
    newPassword: string,
    confirmPassword: string
}) => {

    try {

        const response = await api.post(AUTH_ROUTES.RESET_PASSWORD, data)
        return response

    } catch (error) {

        throw error

    }

}

export const googleLogin = async () => {
    try {
        const response = await api.post(AUTH_ROUTES.GOOGLE_LOGIN);
        return response;
    } catch (error) {
        throw error;
    }
};


export const logout = async () => {

    try {
        const response = await api.post(AUTH_ROUTES.LOGOUT)
        return response
    } catch (error) {
        throw error
    }

}