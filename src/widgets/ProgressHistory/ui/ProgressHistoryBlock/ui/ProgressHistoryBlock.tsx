import { useState } from 'react';
import cl from './progressHistoryBlock.module.scss';
import { FilterSelect, FilterSelectType } from '@/shared/ui/FilterSelect';
import { ProgressHistoryList } from '../../ProgressHistoryList';


export const filterItems: FilterSelectType  [] = [
    {
        label: 'За последние 4 кв',
        id: 'За последние 4 кв',
    },
]

type PropsType = {
    className?: string,
}

const list = [
    {
        fio: 'Ковалев'
    },

    {
        fio: 'Ковалев'
    },

    {
        fio: 'Ковалев'
    },

    {
        fio: 'Ковалев'
    },
];

export function ProgressHistoryBlock ({className = ''} : PropsType) {
    const [filterValue, setFilterValue] = useState<FilterSelectType | null>(filterItems[0]);

    const filterHandler = (value : FilterSelectType | null) => {
        setFilterValue(value);
    }

    return (
        <div className={`${cl.block} ${className}`}>
            <div className='d-flex flex-row align-items-center justify-content-between mb-3'>
                <div className={`${cl.blockTitle} me-3`}>
                    История прогресса
                </div>
                <FilterSelect value={filterValue} items={filterItems} setValue={filterHandler} />
            </div>

            <ProgressHistoryList list={list}/>

        </div>
    )
}