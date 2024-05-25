import { useEffect, useState } from 'react';
import cl from './myProgressHistoryBlock.module.scss';
import { MyProgressHistoryList } from '../MyProgressHistoryList';
import { FilterMultipleSelect, FilterItem } from '@/shared/ui/FilterMultipleSelect';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useSelector } from 'react-redux';
import { HistoryProgressData } from '@/entities/progress/types/ProgressResponse';
import { progressAPIService } from '@/entities/progress';
import { Plug } from '@/shared/ui/Plug/PLug';
import { HistoryProgressStats } from '../../types/ProgressHistoryStats';

// Сделать динамическим
export const filterItems: FilterItem[] = [
    {
        value: '2024-01-01',
        label: '4 кв. 2023 г.',
        id: '4 кв. 2023 г.',
    },

    {
        value: '2024-04-01',
        label: '1 кв. 2024 г.',
        id: '1 кв. 2024 г.',
    },
]

type PropsType = {
    className?: string,
}

export function MyProgressHistoryBlock ({className = ''} : PropsType) {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const [filterValue, setFilterValue] = useState<FilterItem[] | null>([filterItems[0]]);
    const [historyProgressStats, setHistoryProgressStats] = useState<HistoryProgressStats | null>();

    const getPercentByMetrics = (data: HistoryProgressData) => {
        let count = 0;
        const sum = data.reduce((accum, item) => {
            if (item.type === 'metric') {
                count++;
                return accum + item.progress;
            }

            return accum;
        }, 0)

        return (sum === 0 || count === 0) ? '–' : Math.round(sum / count);
    };

    const getSumComplexityByORKs = (data: HistoryProgressData) => {
        const sum = data.reduce((accum, item) => {
            if (item.type === 'task') {
                return accum + item.complexity;
            }
            
            return accum;
        }, 0)

        return +sum.toFixed(1);
    };

    const filterHandler = (value: FilterItem[] | null) => {
        setFilterValue(value);
    }

    const fetchProgressData = async () => {
        if (filterValue) {
            const response = await progressAPIService.readHistory({ 
                login: currentUser.login, 
                quartals: filterValue.map((filter) => filter.value) 
            });
            
            if (response && response.length) {
                setHistoryProgressStats({
                    percentByMetrics: getPercentByMetrics(response),
                    sumComplexityByORKs: getSumComplexityByORKs(response),
                })
                
            }
        } else {
            setHistoryProgressStats(null);
        }
    }

    useEffect(() => {
        fetchProgressData();
    }, [currentUser, filterValue]);

    return (
        currentUser.role !== 'super-user' && (
            <div className={`${cl.block} ${className}`}>
                <div className='d-flex flex-row align-items-center justify-content-between mb-3'>
                    <div className={`${cl.blockTitle} me-3`}>
                        Моя история прогресса 
                    </div>
                    <FilterMultipleSelect value={filterValue} items={filterItems} setValue={filterHandler} />
                </div>
                {historyProgressStats
                    ? <MyProgressHistoryList {...historyProgressStats} />
                    : <Plug title={'История прогресса не найдена'} />
                }
            </div>
        )
    )
}