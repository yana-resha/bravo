export type UserType = {
    ADdescription: string | null,
    avatar: string | null,
    bossFIO: string | null,
    bossLogin: string | null,
    fio: string,
    login: string,
    role: 'super-user' | 'top-user' | 'user',
}

export type userDataType =  UserType & {
    cntComplexity:  number,
    cntPriority: number,
}
