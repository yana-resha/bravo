import { HTTPTransport } from "@/shared/api/HTTPTransport";

const httpTransoprt = new HTTPTransport('concept/');

export async function createGuidingPurpose(request: any) {
    let response: any = await httpTransoprt.post('?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data ?? null;
}
