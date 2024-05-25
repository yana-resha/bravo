import { RatingItemType } from "../types/RatingItemType";

export const ratingList: RatingItemType [] = [
    {
        fio: 'Бондаревский Александр',
        tasks: [
            {
                title: 'Задача 1',
                value: 3,
                status: 'success'
            },
            {
                title: 'Задача 2',
                value: 1,
                status: 'warning'
            },

            {
                title: 'Задача 3',
                value: 3,
                status: 'danger'
            },
        ],
        alert: 3,
        averageValue: '3.0',
    },

    {
        fio: 'Саночкин Дмитрий',
        tasks: [
            {
                title: 'Задача 1',
                value: 3,
                status: 'success'
            },
            {
                title: 'Задача 2',
                value: 1,
                status: 'warning'
            },

            {
                title: 'Задача 3',
                value: 3,
                status: 'success'
            },

            {
                title: 'Задача 4',
                value: 2,
                status: 'danger'
            },

            {
                title: 'Задача 5',
                value: 1,
                status: 'success'
            },
        ],
        alert: 1,
        averageValue: '1.0',
    },

    {
        fio: 'Мельников Александр',
        tasks: [
            {
                title: 'Задача 1',
                value: 1,
                status: 'danger'
            },
            {
                title: 'Задача 2',
                value: 1,
                status: 'warning'
            },

            {
                title: 'Задача 3',
                value: 3,
                status: 'success'
            },

            {
                title: 'Задача 4',
                value: 2,
                status: 'danger'
            },

            
        ],
        averageValue: '2.0',
    },
    {
        fio: 'Ким Ольга',
        tasks: [
            {
                title: 'Задача 1',
                value: 1,
                status: 'danger'
            },
            {
                title: 'Задача 2',
                value: 1,
                status: 'warning'
            },

            {
                title: 'Задача 3',
                value: 3,
                status: 'success'
            },

            {
                title: 'Задача 4',
                value: 1,
                status: 'danger'
            },

            
        ],
        averageValue: '0',
    }
]