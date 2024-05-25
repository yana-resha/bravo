import { TaskType, taskItemsObjType } from "../../types/TaskType";

export const taskItems: TaskType[] = [
    {
        label: 'OKR - задачи первого уровня',
        id: 'OKR',
    },
    {
        label: 'Задача',
        id: 'KR',
    },
    {
        label: 'Метрика',
        id: 'metric',
    },
    {
        label: 'Стратегическая метрика',
        id: 'strategyMetric',
    }
];

export const taskItemsDefult: TaskType[] = [
    {
        label: 'Задача',
        id: 'KR',
    },
    {
        label: 'Метрика',
        id: 'metric',
    }
];

export const taskItemsObj: taskItemsObjType = {
    'user': taskItemsDefult,
    'top-user': taskItems,
    'super-user': taskItems
}