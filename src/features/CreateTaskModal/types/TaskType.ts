import type { userRoles } from "@/entities/user/types/userTypes";

export type TaskType = {
    label: 'OKR - задачи первого уровня' | 'Задача' | 'Метрика' | 'Стратегическая метрика',
    id: 'OKR' | 'KR' | 'metric' | 'strategyMetric',
}

export type TaskIDType = TaskType['id'];
export type TaskLabelType = TaskType['label'];

export type taskItemsObjType = Record<userRoles, TaskType[]>;