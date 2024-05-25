import { HTTPTransport } from "@/shared/api/HTTPTransport";

const httpTransoprt = new HTTPTransport('concept/');

export async function readGuidingPurpose(request: any) {
    let response: any = await httpTransoprt.get('?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data ?? null;
}
