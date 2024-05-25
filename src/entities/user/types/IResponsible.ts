import { ResponsibleType } from "@/shared/types/responsibleType";
import { IUserDataFull } from "./IUserData";

export default interface IResponsible extends IUserDataFull {
    strategyList?: any[],
    [key: string]: any,
}