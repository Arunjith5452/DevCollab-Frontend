
export interface AcceptanceCriteria {
    text: string;
    completed: boolean;
}

export interface TaskComment {
    createdAt: string | Date;
    message: string;
    userId: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'improvement-needed';

export interface ProjectTask {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    assignedId: string;
    deadline?: string | null;
    tags?: string[];
    payment: number;
    approval?: "approved" | "improvement-needed" | "under-review";
    prLink?: string;
    feedback?: string
    workDescription?: string;
    escrowStatus?: "not-paid" | "held" | "released";
    acceptanceCriteria?: AcceptanceCriteria[];
    documents?: string[];
    comments?: TaskComment[];
}


export interface CreateTaskPayload {
    title: string;
    description: string;
    projectId: string;
    assignedId?: string;
    deadline: string;
    tags: string[];
    acceptanceCriteria: Array<{ text: string; completed: boolean }>;
    payment?: {
        amount: number;
        escrowStatus?: 'not-paid' | 'held' | 'released';
    };
    documents?: string[];
    status?: TaskStatus;
}
