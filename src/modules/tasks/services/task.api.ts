import api from "@/lib/axios"
import { TASK_ROUTERS } from "@/shared/constant/routes"


export const createTask = async (data: any) => {

    try {

        const response = await api.post(TASK_ROUTERS.CREATE_TASK, data)

        return response.data

    } catch (error) {

        throw error

    }

}

export const getAssignees = async (projectId: string) => {
    try {

        const response = await api.get(`${TASK_ROUTERS.GET_ASSIGNEES}/${projectId}`)

        return response

    } catch (error) {
        throw error
    }
}

export const addComment = async (taskId: string, message: string) => {
    try {
        const response = await api.patch(`/api/tasks/${taskId}/comment`, { message });
        return response.data;
    } catch (error) {
        throw error;
    }
}