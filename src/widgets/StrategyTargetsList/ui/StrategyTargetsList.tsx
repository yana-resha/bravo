/* Hooks */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


/* Entities */
import StrategyTargetItemUI from '@/entities/StrategyTarget';

/* Components */
import { Alert, Spinner } from 'react-bootstrap';
import FullStrategyTarget from './FullStrategyTarget';

/* Types */
import { ThunkDispatch } from '@reduxjs/toolkit';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { IStrategyTarget } from '@/entities/StrategyTarget/types/StrategyTargetTypes';
import { fetchStrategyTargetList } from '@/entities/StrategyTarget/model/slices/strategyTargetSlice';
import { useFilterList } from '@/shared/hooks/useFilterList';
import ListPanel from './ListPanel/ListPanel';
import { AnimationListItem } from '@/shared/ui/AnimationListItem';


export const StrategyTargetsList = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const reduxData = useSelector((state: StoreReducerType) => state.strategyTarget);

    const strategyTargetsState = reduxData.strategyTargetsList;
    const strategyTargetsList = strategyTargetsState.list;
    const strategyTargetsListLoading = strategyTargetsState.listLoading;
    const strategyTargetsListError = strategyTargetsState.listError;

    const {filterList, setFilterValue, deleteFilterValue, setIncludesFilter, applied} 
    = useFilterList({list: strategyTargetsList, searchInArray: ['responsibles'], searchInObject: [{filterKey: 'responsibles', objectKey: 'login'}]});

    useEffect(() => {
        dispatch(fetchStrategyTargetList({ login: currentUser.login }) );
    }, []);

    return (
        <>

            <ListPanel
                setIncludesValue={setIncludesFilter} 
                setFilters={setFilterValue}
                deleteFilters={deleteFilterValue}
            />
            {
                strategyTargetsList.map((item: IStrategyTarget, index: number) => {
                    const StTargetItem: JSX.Element = <StrategyTargetItemUI {...item} />;
                    let isVisible = true;
                    if (filterList?.every(i => i !== item.id)) isVisible = false;
                    return ( 
                        <AnimationListItem key={item.id} index={index}>
                            <FullStrategyTarget isVisible={isVisible} StTargetID={item.id} StTargetItem={StTargetItem} />
                        </AnimationListItem>
                    );
                })
            }

            {applied && filterList.length == 0 && strategyTargetsList.length > 0 && !strategyTargetsListLoading && !strategyTargetsListError && (
                <Alert 
                    className='d-flex justify-content-center'
                    variant={'primary'}>
                    По выбранным фильтам ничего не найдено 
                </Alert>       
            )}
            
            {
                strategyTargetsList.length == 0 && !strategyTargetsListLoading && !strategyTargetsListError && (
                    <Alert 
                        className='d-flex justify-content-center'
                        variant={'primary'}
                    >
                        Список пуст
                    </Alert>
                )
            }

            {
                strategyTargetsListError && (
                    <Alert 
                        className='d-flex justify-content-center'
                        variant={'danger'}
                    >
                        {strategyTargetsListError}
                    </Alert>
                )
            }

            {
                strategyTargetsListLoading && (
                    <div className='d-flex flex-column align-items-center justify-content-center p-3'>
                        <Spinner animation="border" variant="primary" />
                        <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                    </div>
                )
            }
        </>
    )    
}