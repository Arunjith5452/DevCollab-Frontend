import api from "@/lib/axios"
import { PROJECT_ROUTES } from "@/shared/constant/routes"




export const createProject = async (data: any) => {

    try {

        const response = await api.post(PROJECT_ROUTES.CREATE_PROJECT, data)
        return response.data

    } catch (error) {
        throw error
    }

}

export const listProject = async ({ search = '', techStack = '', difficulty = '', roleNeeded = '', page = 1, limit = 7 } = {}) => {
    try {

        const response = await api.get(PROJECT_ROUTES.PROJECT_LISTING, {
            params: { search,techStack,difficulty,roleNeeded, page, limit }
        })

        return response.data

    } catch (error) {

        throw error

    }
}

export const projectDetails = async (projectId:string) => {
    try {

        const response = await api.get(`${PROJECT_ROUTES.PROJECT_DETAILS}/${projectId}`)

        return response

    } catch (error) {

        throw error

    }
}