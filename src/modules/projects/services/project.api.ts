import api from "@/lib/axios"
import { PROJECT_ROUTES } from "@/shared/constant/routes"
import { BaseProjectPayload } from "@/modules/projects/types/project.types"




export const createProject = async (data: BaseProjectPayload) => {

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
            params: { search, techStack, difficulty, roleNeeded, page, limit }
        })

        return response.data

    } catch (error) {

        throw error

    }
}

export const projectDetails = async (projectId: string) => {
    try {

        const response = await api.get(`${PROJECT_ROUTES.PROJECT_DETAILS}/${projectId}`)

        return response

    } catch (error) {

        throw error

    }
}

export const applyToJoin = async (projectId: string,
    data: { techStack: string[]; profileUrl: string; reason: string }) => {
    try {

        const response = await api.post(`${PROJECT_ROUTES.APPLY_PROJECT}/${projectId}/apply`, data)

        return response

    } catch (error) {
        throw error
    }
}

export const getPendingApplications = async (projectId: string) => {

    try {

        const response = await api.get(`${PROJECT_ROUTES.GET_PENDING_APPLICATIONS}/${projectId}/applications`)

        return response.data

    } catch (error) {

        throw error

    }
}

export const approveApplication = async (applicationId: string, projectId: string) => {

    try {

        const response = await api.post(`${PROJECT_ROUTES.APPLICATION_STATUS}/${applicationId}/approve/${projectId}`)
        return response

    } catch (error) {
        throw error

    }
}

export const rejectApplication = async (applicationId: string) => {

    try {

        const response = await api.post(`${PROJECT_ROUTES.APPLICATION_STATUS}/${applicationId}/reject`)
        return response

    } catch (error) {
        throw error

    }
}

export const getMyAppliedProject = async () => {

    try {

        const response = await api.get(PROJECT_ROUTES.GET_APPLIED_PROJECT)
        return response

    } catch (error) {
        throw error
    }

}

export const getMyCreatedProject = async () => {
    try {

        const response = await api.get(PROJECT_ROUTES.GET_MY_PROJECT)
        return response

    } catch (error) {
        throw error
    }
}

export const getProjectForEdit = async (projectId: string) => {
    try {

        const response = await api.get(`${PROJECT_ROUTES.GET_PROJECT_FOR_EDIT}/${projectId}/edit`)

        return response

    } catch (error) {
       throw error
    }
}

export const editProject = async ({
    projectId,
    data
}: {
    projectId: string;
    data: BaseProjectPayload;
}) => {
    try {
        const response = await api.patch(`${PROJECT_ROUTES.EDIT_PROJECT}/${projectId}/edit`, data);
        return response.data
    } catch (error) {
        throw error;
    }
};
