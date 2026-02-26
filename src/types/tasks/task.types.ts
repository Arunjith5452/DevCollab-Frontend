export interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    deadline: string;
    assignedId?: string;
    user?: {
        name: string;
    };
    prLink?: string;
    tags?: string[];
    approval?: string;
    workDescription?: string;
    feedBack?: string;
    payment?: {
        amount: number;
        escrowStatus: string;
    };
    createdAt?: string;
    updatedAt?: string;
}
