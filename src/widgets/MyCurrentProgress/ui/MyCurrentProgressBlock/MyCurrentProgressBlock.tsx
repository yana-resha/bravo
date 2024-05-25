import { CurrentProgressData, progressAPIService } from '@/entities/progress';
import { MyCurrentProgressList } from '../MyCurrentProgressList';
import cl from './myCurrentProgressBlock.module.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { Plug } from '@/shared/ui/Plug/PLug';

type Props = {
    className?: string,
}

export function MyCurrentProgressBlock ({className = ''} : Props) {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const [progressData, setProgressData] = useState<CurrentProgressData | null>(null);

    const fetchProgressData = async () => {
        const response = await progressAPIService.readCurrent({ login: currentUser.login });
        setProgressData(response);
    }

    useEffect(() => {
        fetchProgressData();
    }, [currentUser]);

    return (
        currentUser.role !== 'super-user' && (
            <div className={`${cl.block} ${className}`}>
            <div className={cl.blockTitle}>
                    Текущий прогресс по моим задачам
            </div>
                {progressData !== null 
                    ? <MyCurrentProgressList progressData={progressData} />
                    : <Plug title={'Прогресс не найден'} />
                }
            </div>
        )
    )
}