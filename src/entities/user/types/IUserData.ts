import IUser from "./IUser";
import { userRoles } from "./userTypes";

export default interface IUserData extends IUser {
    bossLogin?: string | null | undefined,
    bossFio?: string | null | undefined,
    ADdescription?: string | null | undefined,
    role?: userRoles | null | undefined
}

export interface IUserDataFull extends IUserData {
    cntComplexity?:  number | null,
    cntPriority?: number | null,
    [key: string] : any,
}