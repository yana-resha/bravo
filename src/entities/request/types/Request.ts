export type CreateRequest = {
    login: string;
    idTask: number | string;
    manager_comment?: string | null;
    status?: boolean | null;
    user_comment?: string | null;
    dueDate?: string;
    qbody: {
        status?: boolean | null;
        complexity?: number | null;
        dueDate?: string | null;
    }
}

export type ReadByTaskRequest = {
    login: string;
    idTask: string;
}

export type UpdateRequest = {
    login: string;
    id: number | string;
    status: boolean;
    manager_comment?: string | null;
}