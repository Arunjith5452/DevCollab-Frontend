import api from "@/lib/axios"
import { ADMIN_ROUTES } from "@/shared/constant/routes"


export const getAllUsers = async ({ search = '', role = '', status = '', page = 1, limit = 7 } = {}) => {
    try {
        const response = await api.get(ADMIN_ROUTES.GET_ALL_USERS, {
            params: { search, role, status, page, limit }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateUserStatus = async (data: {
    userId: string,
    newStatus: string
}) => {

    try {
        const response = await api.patch(ADMIN_ROUTES.UPDATE_USER_STATUS(data.userId), { newStatus: data.newStatus })
        return response

    } catch (error) {
        throw error
    }

}


export const getAllProjects = async ({ search = '', difficulty = '', status = '', page = 1, limit = 7 } = {}) => {
    try {
        const response = await api.get(ADMIN_ROUTES.GET_ALL_PROJECTS, {
            params: { search, difficulty, status, page, limit }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateProjectStatus = async (data: {
    projectId: string,
    newStatus: string
}) => {

    try {
        const response = await api.patch(ADMIN_ROUTES.UPDATE_USER_STATUS(data.projectId), { newStatus: data.newStatus })
        return response

    } catch (error) {
        throw error
    }

}