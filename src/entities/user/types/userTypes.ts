import IUserData from "./IUserData";

export enum userRoles {
    defaultUser = 'user',
    topUser = 'top-user',
    superUser = 'super-user'
}

export type UserStateType = {
    error: boolean | string | any,
    isLoading: boolean,
    user: IUserData,
}