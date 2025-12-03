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