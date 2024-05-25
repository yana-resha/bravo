import { HTTPTransport } from "../HTTPTransport";
import { ServerResponseType } from "@/shared/types/ServerResponseType";

export async function cloudAuthAPI(login: string) {
    const httpTransoprt = new HTTPTransport('cloud-auth/');
    const response: ServerResponseType<any> = await httpTransoprt.get('?', { login });

    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);

    return response.data;
}