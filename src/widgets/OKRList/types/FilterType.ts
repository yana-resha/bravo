export enum FilterKeys  {
    period = 'period',
    responsibles = 'responsibles',
    complexity = 'complexity',
    checkin = 'checkin',
    status = 'status',
    direction = 'direction',
    initiator = 'initiator',
}

export type FiltersType = {
    key: FilterKeys,
    value: string [],
}