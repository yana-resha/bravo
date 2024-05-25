import cl from './OKRList.module.scss';
import {useEffect, useState } from 'react';
import ListPanel from '../OKRPanel/OKRPanel';
import { OKRReduxListTypes, fetchCancelList, fetchDoneList, fetchInProgressList } from '@/entities/task/model/slices/okrListSlice';
import { useDispatch, useSelector, } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useFilterList } from '../../libs/hooks/useFilterList';
import { TaskTable } from '@/features/TaskTable/ui/TaskTable/TaskTable';
import { Checkbox } from '@mui/material';
import { FilterKeys, FiltersType } from '../../types/FilterType';
import { TaskTableColumns } from '@/features/TaskTable/types';

const TasksRowConfig = [
    TaskTableColumns.titleCell,
    TaskTableColumns.complexityCell,
    TaskTableColumns.onwerCell,
    TaskTableColumns.progressCell,
    TaskTableColumns.checkinCell,
    TaskTableColumns.controlCheckinCell,
    TaskTableColumns.attentionCell,
    TaskTableColumns.openTaskCell,
];


export function OKRList () {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const reduxData = useSelector((state: StoreReducerType) => state.okrList);
    const [activeCategories, setActiveCategories] = useState<OKRReduxListTypes[]>([]);
    const activeList = reduxData[`${activeCategories[0] ? activeCategories[0] : OKRReduxListTypes.inprogressList}`].list;
    const activeListLoading  = activeCategories[0] ? reduxData[`${activeCategories[0]}`].loading : false;
    const activeListError = activeCategories[0] ? reduxData[`${activeCategories[0]}`].error : false;
    const {filterList, setIncludesFilter, applied, setFilterValues} = useFilterList({listCategory: activeCategories[0]});
    function changeActiveCategory(values: OKRReduxListTypes[]) {
        setActiveCategories((prevValues) => {
            values.forEach(val => {
                if (!prevValues.find(el => el == val)) {
                    loadList(val);
                    
                }
            })
            return values;
        });
    };
    function loadList(value: OKRReduxListTypes) {
        switch (value) {
            case OKRReduxListTypes.inprogressList: 
                dispatch(fetchInProgressList({login: currentUser.login})) 
                break;
            case OKRReduxListTypes.doneList: 
                dispatch(fetchDoneList({login: currentUser.login})) 
                break;
            case OKRReduxListTypes.cancelList: 
                dispatch(fetchCancelList({login: currentUser.login})) 
                break;
        }
    }
    const [drTableFilters, setDrFilterTables] = useState<FiltersType[]>([]);
    const changeFilterValues = (key: FilterKeys | null, value: FiltersType['value']) => {
        setFilterValues(key, value);
        if (key && key == FilterKeys['responsibles']) {
            setDrFilterTables([{
                key,
                value,
            }])
        }
    }

    return (
        <div className={cl.mainContainer}>
            <ListPanel
                setIncludesValue={setIncludesFilter}
                setListStatus={changeActiveCategory}
                setFilterValues={changeFilterValues}
            />
            
            <div className='position-relative mb-3'>
                <TaskTable 
                    activeList={activeList}
                    filterList={filterList}
                    listLoading={activeListLoading}
                    listError={activeListError}
                    applied={applied}
                    rowConfig={TasksRowConfig} 
                />                
            </div>

            {/* <div 
            className='mb-3'
            >
                <OKRDRTable 
                filters={drTableFilters}
                />
            </div> */}
        </div>
    )
}
