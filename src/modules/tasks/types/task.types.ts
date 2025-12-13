
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
    advancePaid: number;
    acceptanceCriteria?: AcceptanceCriteria[];
    documents?: string[];
    comments?: TaskComment[];
}

