import { CreateRequest } from "./Request"

export type ReadResponse = {
    login: string;
    id: number | string;
    manager_comment?: string | null;
    status?: boolean | null;
    user_comment?: string | null;
    dueDate: string;
    qbody: {
        status?: string | null;
        complexity?: number | null;
        dueDate?: string | null;
    }
}

export type CreateResponse = CreateRequest;