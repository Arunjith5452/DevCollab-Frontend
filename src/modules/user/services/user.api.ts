import api from "@/lib/axios"
import { USER_ROUTERS } from "@/shared/constants/routes"


export interface EditProfilePayload {
    username: string;
    title: string | null;
    bio: string | null;
    techStack: string[] | null;
    profileImage: string | null;
}



export const userProfile = async () => {
    try {

        const response = await api.get(USER_ROUTERS.USER_PROFILE)

        return response

    } catch (error) {

        throw error

    }
}

export const editProfile = async (data: EditProfilePayload) => {

    try {
        const response = await api.patch(USER_ROUTERS.EDIT_PROFILE, data)

        return response

    } catch (error) {
        throw error
    }
}