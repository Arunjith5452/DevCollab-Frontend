import api from "@/lib/axios"
import { PROJECT_ROUTES } from "@/shared/constant/routes"
import { BaseProjectPayload, GetAiSuggestionsResponse } from "@/modules/projects/types/project.types"




export const createProject = async (data: BaseProjectPayload) => {

    try {

        const response = await api.post(PROJECT_ROUTES.CREATE_PROJECT, data)
        return response.data

    } catch (error) {
        throw error
    }

}

export const listProject = async ({ search = '', techStack = '', difficulty = '', roleNeeded = '', page = 1, limit = 7, sort = '' } = {}) => {
    try {

        const response = await api.get(PROJECT_ROUTES.PROJECT_LISTING, {
            params: { search, techStack, difficulty, roleNeeded, page, limit, sort }
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


export const getProjectMember = async (projectId: string) => {

    try {

        const response = await api.get(`${PROJECT_ROUTES.GET_PROJECT_MEMBERS}/${projectId}/members`)
        return response

    } catch (error) {

        throw error

    }

}

export const disableProject = async (projectId: string) => {
    try {

        const response = await api.patch(`${PROJECT_ROUTES.DISABLE_PROJECT}/${projectId}/disable`)

        return response

    } catch (error) {
        throw error
    }
}

export const getProjectStats = async (projectId: string) => {
    try {
        const response = await api.get(`${PROJECT_ROUTES.PROJECT_DETAILS}/${projectId}/stats`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const getContributorStats = async (projectId: string, page: number = 1, limit: number = 10) => {
    try {
        const response = await api.get(`${PROJECT_ROUTES.PROJECT_DETAILS}/${projectId}/contributor-stats`, {
            params: { page, limit }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const getPlatformStats = async () => {
    try {
        const response = await api.get('/api/platform/stats')
        return response.data
    } catch (error) {
        throw error
    }
}

export const getFeaturedProjects = async () => {
    try {
        const response = await api.get('/api/projects/featured')
        return response.data
    } catch (error) {
        throw error
    }
}

export const getAiSuggestions = async (projectId: string): Promise<GetAiSuggestionsResponse> => {
    try {
        const response = await api.get<GetAiSuggestionsResponse>(`${PROJECT_ROUTES.GET_AI_SUGGESTIONS}/${projectId}/ai-suggestions`)
        return response.data
    } catch (error) {
        throw error
    }

}

export const getProjectMeetings = async (projectId: string, params: { page: number; limit: number; status: string }) => {
    try {
        const response = await api.get(`${PROJECT_ROUTES.GET_MEETINGS}/${projectId}/meetings`, {
            params
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const createMeeting = async (data: { projectId: string; title: string; date: string; endTime: string; type: string }) => {
    try {
        const response = await api.post(PROJECT_ROUTES.CREATE_MEETING, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateMeetingStatus = async (meetingId: string, status: string) => {
    try {
        const response = await api.patch(`${PROJECT_ROUTES.UPDATE_MEETING_STATUS}/${meetingId}/status`, { status });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getProjectMembers = async (projectId: string, params: { search: string; page: number; limit: number }) => {
    try {
        const response = await api.get(`${PROJECT_ROUTES.GET_PROJECT_MEMBERS}/${projectId}/members`, {
            params
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateMemberRole = async (projectId: string, memberId: string, role: string) => {
    try {
        const response = await api.patch(`${PROJECT_ROUTES.PROJECT_DETAILS}/${projectId}/members/${memberId}/role`, { role });
        return response;
    } catch (error) {
        throw error;
    }
}

export const removeMember = async (projectId: string, memberId: string) => {
    try {
        const response = await api.delete(`${PROJECT_ROUTES.PROJECT_DETAILS}/${projectId}/members/${memberId}`);
        return response;
    } catch (error) {
        throw error;
    }
}