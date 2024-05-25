
import { useState } from 'react';
import { SelfRatingList } from '../../SelfRatingList';
import cl from './SelfRatingBlock.module.scss';
import { ratingList } from '@/widgets/SelfRating/data/ratingList';
import { FilterSelect, FilterSelectType } from '@/shared/ui/FilterSelect';


export const filterItems: FilterSelectType  [] = [
    {
        label: 'Последняя неделя',
        id: 'Последняя неделя',
    },

    {
        label: '15.01.2024-21.01.2024',
        id: '15.01.2024-21.01.2024',
    },

    {
        label: '8.01.2024-14.01.2024',
        id: '8.01.2024-14.01.2024',
    },
]


export function SelfRatingBlock () { 

    const [filterValue, setFilterValue] = useState<FilterSelectType | null>(filterItems[0]);
    const [list, setList] = useState(ratingList);

    const filterHandler = (value : FilterSelectType | null) => {
        setFilterValue(value);
    }

    return (

        <div className={cl.block}>
            <div className='d-flex flex-row justify-content-between align-items-start'>
                <div className={`${cl.blockTitle} me-3`}>Прогноз OKR (самооценка)</div>
                
                <FilterSelect value={filterValue} items={filterItems} setValue={filterHandler} />
                
            </div>
            <SelfRatingList list={list}/>
        </div>

        
    )
}