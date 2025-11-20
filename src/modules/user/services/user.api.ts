import api from "@/lib/axios"
import { USER_ROUTERS } from "@/shared/constant/routes"



export const userProfile = async () => {
    try {

        const response = await api.get(USER_ROUTERS.USER_PROFILE)

        return response

    } catch (error) {

        throw error

    }
}

export const editProfile = async () => {

    try {
        const response = await api.patch(USER_ROUTERS.EDIT_PROFILE)

        return response

    } catch (error) {
        throw error
    }
}