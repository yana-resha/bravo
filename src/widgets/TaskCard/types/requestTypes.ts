export enum requestTypes {
    statusSuccess,
    statusCancel,
    complexity,
    deadline
}

export enum requestTypesLabels {
    statusSuccess = 'Подтвердить выполнение задачи',
    statusCancel = 'Подтвердить отмену задачи',
    complexity = 'Изменить сложность',
    deadline = 'Изменить дедлайн' 
}

export enum requestStatusLabels {
    success = 'одобрено',
    fail = 'отказано'
}