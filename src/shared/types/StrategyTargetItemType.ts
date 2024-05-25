type strategyTargetResponsible = {
    fio: string, 
    login: string, 
    avatar: string,
}

export type StrategyTargetItemType = {
    id: string,
    title: string,
    responsibles: strategyTargetResponsible[] | null,
    createDate: string,
    updateDate: string,
    createLogin: string,
    updateLogin: string,
    createFIO: string,
    updateFIO: string
}