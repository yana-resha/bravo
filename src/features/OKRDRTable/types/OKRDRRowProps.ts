import IResponsible from "@/entities/user/types/IResponsible"
import { ChangeQuartalValuesFunc, QuartalType, QuartalValuesType } from "./QuartalType"

export type OKRDRRowProps = {
    responsible: IResponsible,
    quartals: QuartalType[],
    isVisible?:boolean,
}

export type OKRDREmployeeCell = {
    employee: OKRDRRowProps['responsible'],
}



export type OKRDRComplexityInQuartalCell = QuartalValuesType & {
    login: string,
    changeValuesFunc: ChangeQuartalValuesFunc,
}