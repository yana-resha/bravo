/* Hooks */
import { useSelector } from 'react-redux';

/* Components */
import { PriorityTaskList } from '../PriorityTaskList';

/* Styles */
import cl from './priorityTaskBlock.module.scss';

/* Types */
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';

export function PriorityTaskBlock () {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    
    return (
        currentUser.role !== 'super-user' && (
            <div>
                <div className='mb-2'>
                    <div className={`${cl.title}`}>
                        Приоритетные задачи
                    </div>
                    <div className={cl.subTitle}>
                        Оперативные задачи 
                    </div>
                </div>
                <PriorityTaskList />
            </div>
        )
    )
}