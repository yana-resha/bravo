import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { Card } from "@consta/uikit/Card";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cl from './MetricList.module.scss';
import { AnimationListItem } from "@/shared/ui/AnimationListItem";
import { Alert, Spinner } from "react-bootstrap";
import ListPanel from "../ListPanel/ListPanel";
import { fetchStrategyMetricList } from "../../model/slices/StrategicMetricSlice";
import { fetchMetricList } from "../../model/slices/MetricListSlice";
import { MetricItem } from "../MetricItem/MetricItem";
import { useFilterList } from "@/shared/hooks/useFilterList";

type MetricListProps = {
    type: 'strategyMetric' | 'metric';
}

export function MetricList ({ type }: MetricListProps) {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const reduxData = useSelector((state: StoreReducerType) => {
        switch(type) {
            case 'strategyMetric':
                return state.strategyMetric;
            default:
                return state.metricList;
        }
    });
    
    const list = reduxData.list;
    const errorList = reduxData.error;
    const listIsLoading = reduxData.isLoading;
    const {filterList, setFilterValue, deleteFilterValue, setIncludesFilter, applied} = useFilterList({list: list});

    // чтобы все коллапсы скрывались
    const [closeCollapse , changeCloseCollapse] = useState(false);
    
    useEffect(() => {
        switch(type) {
            case 'strategyMetric':
                dispatch(fetchMetricList({login: currentUser.login}));
            default:
                dispatch(fetchStrategyMetricList({login: currentUser.login}));
        }
    }, []);


    return (
        <>
        <div className={`d-flex flex-column ms-1 me-1`}>
            <Card
                verticalSpace="s"
                horizontalSpace="s"
                className={`${cl.listCard} mb-3 mt-2 w-100 bg-body d-flex flex-column`}
            >
                <ListPanel
                    setIncludesValue={setIncludesFilter} 
                    setFilters={setFilterValue}
                    deleteFilters={deleteFilterValue}
                    changeCloseCollapse={changeCloseCollapse}
                />
                <div
                >
                    {list.map((item:any , index: number) => {
                        let isVisible = true;
                        if (filterList?.every(i => i !== item.id)) isVisible = false;
                        return (
                            <AnimationListItem key={item.id} index={index}>
                                <MetricItem 
                                key={item.id} 
                                {...item} 
                                isVisible={isVisible}
                                closeCollapse={closeCollapse}
                                />
                            </AnimationListItem>
                        );
                    })}

                    {applied && filterList.length == 0 && list.length > 0 && !listIsLoading && !errorList && (
                        <Alert
                            className='d-flex justify-content-center'
                            variant={'primary'}>
                            По выбранным фильтам ничего не найдено 
                        </Alert>       
                    )}

                    {
                        list.length == 0 && !listIsLoading && !errorList && (

                            <Alert 
                            className='d-flex justify-content-center'
                            variant={'primary'}>
                                Список пуст
                            </Alert>
                        )
                    }

                    {
                        errorList && (

                            <Alert 
                            className='d-flex justify-content-center'
                            variant={'danger'}>
                                {errorList}
                            </Alert>
                        )
                    }

                    {
                        listIsLoading && (
                            <div className='d-flex flex-column align-items-center justify-content-center p-3'>

                                <Spinner animation="border" variant="primary" />
                                <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                            </div>
                        )
                    }

    

                    
                </div>
            </Card>
        </div>
        </>
    )
}


