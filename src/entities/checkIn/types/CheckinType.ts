export enum CheckinStatus {
    normal = 'по плану',
    warning = 'с опозданием',
    danger = 'под угрозой'
};

export type CheckinItemType = {
    updateDate: string,
    updateFIO: string,
    updateLogin: string,
    [key : string] : any,
    ciStatus: CheckinStatus,
    ciDate: string,
    cd: string,
    createDate: string,
    createLogin: string,
    ciSeen: string | null,
    id: string,
    idTask: string,
    procent: number,
    progresschange: number;
    task: {
        id: string,
        title: string,
    },
    title: string,
}

export type CheckINCreateRequest = {
    login: string,
    ciStatus: CheckinStatus,
    idTask: string,
};

export type CheckINRead = {
    login: string,
    id?: string,
    idTask?: string,
    limit?: number,
    start?:number,
};

export type CheckINUpdateRequest = {
    id: number,
    login: string,
    idTask: number,
    ciStatus?: CheckinStatus,
    ciLock?: 1 | 0,
    ciSeen?: string;
}

export type CheckINReadResponse = {
    list: CheckinItemType[],
    count: number,
}

export type CheckINIntensityStats = {
    user: {
        login: string;
        fio: string;
        avatar: string;
    };
    weeks: {
        status: string;
        lastDate: string;
    }[]
}[];
