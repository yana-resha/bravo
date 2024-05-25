/* Hooks */
import { useEffect } from 'react';

/* Redux */
import { useDispatch, useSelector, } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

/* State */
import { fetchPriorityList } from '@/entities/task/model/slices/priorityTaskSlice';

/* Types */
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';

/* Styles */
import cl from './priorityTaskList.module.scss';

/* Components */
import { Alert, Spinner } from 'react-bootstrap';
import { PriorityTaskItem } from '../../PriorityTaskItem';
import { PriorityTaskItemAdd } from '../../PriorityTaskAddItem';
import { AnimationListItem } from '@/shared/ui/AnimationListItem';

export function PriorityTaskList () {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const reduxData = useSelector((state: StoreReducerType) => state.priorityTaskList);
    const priorityTaskList = reduxData.list;
    const isLoading = reduxData.loading;
    const errorLoading = reduxData.error;

    useEffect(() => {
        dispatch(fetchPriorityList({login: currentUser.login}))
    }, []);
    
    return (
        <div className={cl.list}>
            {isLoading && (
                <div className='d-flex flex-column align-items-center justify-content-center p-3'>                                    
                    <Spinner animation="border" variant="primary" />
                    <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                </div>
            )}

            {errorLoading && (
                <Alert 
                    className='d-flex justify-content-center'
                    variant={'danger'}>
                    {errorLoading}
                </Alert>
            )}

            {!priorityTaskList.length && (
                <Alert 
                    className='d-flex justify-content-center'
                    variant={'primary'}>
                    Список пуст
                </Alert>
            )}

            {!errorLoading && priorityTaskList.map((el: any, index: number) => {
                return (
                    <AnimationListItem index={index}>
                        <PriorityTaskItem key={el.id} task={el} />
                    </AnimationListItem>
                )
            })}

            {priorityTaskList.length && priorityTaskList.length < 5 &&
                <AnimationListItem index={priorityTaskList.length}>
                    <PriorityTaskItemAdd />
                </AnimationListItem>
            }
        </div>
    )
}