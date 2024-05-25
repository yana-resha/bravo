import IUserData, { IUserDataFull } from "@/entities/user/types/IUserData";
import IResponsible from "@/entities/user/types/IResponsible";

import { HTTPTransport } from "@/shared/api/HTTPTransport";
import { ServerResponseType } from "@/shared/types/ServerResponseType";
import { UserRequestType } from "@/shared/types/User/UserRequestType";
import { ResponsibleType } from "@/shared/types/responsibleType";

const httpTransoprt = new HTTPTransport('user/');

export async function getUser(request: UserRequestType) : Promise<IUserData| false> {
    let response : ServerResponseType<IUserData>  = await httpTransoprt.get('?', request)
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data??false;
}

// --------------------------------------------------
// ВНИМАНИЕ! В файле src\features\ResponseComplexityTaskModal\ui\ResponseComplexityTaskModal.tsx 
// функция используется с чужим логином! Если поменяется механика передачи логина 
// (например, автоматизация передачи логина во все апишки) нужно будет это учесть!
export async function getUserData(request: UserRequestType) : Promise<IUserDataFull | false> {
    let response : ServerResponseType<IUserDataFull>  = await httpTransoprt.get('data/?', request)
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data??false;
}

export async function getDirectList(request: UserRequestType): Promise<IResponsible[]> {
    let response : ServerResponseType<IResponsible[]>  = await httpTransoprt.get('direct-reports/?', request)
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data??[];
}

export async function getEmplyeerList(request: {name: string}): Promise<IResponsible[]> {
    let response : ServerResponseType<IResponsible[]>  = await httpTransoprt.get('dr-find/?', request)
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data??[];
}
