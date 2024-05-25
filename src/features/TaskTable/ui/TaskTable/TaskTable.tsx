import { AnimationListItem } from '@/shared/ui/AnimationListItem';
import './TaskTable.scss';
import { Spinner } from 'react-bootstrap';
import TaskItem from '../TaskItem';
import SubTasksList from '../SubTasksList';
import { useEffect, useRef, useState } from 'react';
import { TaskTableColumns } from '../../types';
import { SortKeysEnum, SortValueEnum, useSortList } from '@/widgets/OKRList/libs/hooks/useSortList';
import { AnimatePresence, motion } from 'framer-motion';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { KRItemType } from '@/entities/task/types/KRItemType';
import { scroll } from "framer-motion"
import { getListWithoutDuplicate } from '@/entities/task/utils';


type TaskTablePropsType = {
    activeList: (OKRItemType | KRItemType)[],
    filterList?: string[],
    applied?: boolean,
    listLoading: boolean,
    listError: any,
    rowConfig?: TaskTableColumns[] | null,
    className?: string
}

export const TaskTable = ({activeList, filterList, listLoading, listError, applied = false, rowConfig = null, className = ''}: TaskTablePropsType) => {
    const defaultRowConfig: TaskTableColumns[] = [
        TaskTableColumns.titleCell,
        TaskTableColumns.complexityCell,
        TaskTableColumns.weightCell,
        TaskTableColumns.onwerCell,
        TaskTableColumns.progressCell,
        TaskTableColumns.checkinCell,
        TaskTableColumns.controlCheckinCell,
        TaskTableColumns.attentionCell,
        TaskTableColumns.openTaskCell
    ];
    const currentRowConfig: TaskTableColumns[] = rowConfig || defaultRowConfig;
    
    // чтобы все коллапсы скрывались
    const taskIDs: string[] = [];
    const [closeCollapse , changeCloseCollapse] = useState(false);
    const {sortList, setSort, sortValues} = useSortList({list: activeList});
    const tableRef = useRef<null | HTMLDivElement>(null);


    const handlerSortBtn = (key: SortKeysEnum, val: SortValueEnum | null = null) : void => {
        let sortValue = sortValues.find(el => el.key == key)?.value;
        let value =  sortValue == SortValueEnum.down || sortValue == null ? SortValueEnum.up : SortValueEnum.down;
        if (val) value = val;
        setSort(key, value);
    }

    const getRotateSortBtn = (key: SortKeysEnum) : string => {
        let value = sortValues.find(el => el.key == key)?.value;
        let rotate = value  ==  null || value == SortValueEnum.down ? 'rotate(0deg)' : 'rotate(-180deg)';
        return rotate;
    }

    const [result, setResult] = useState({
        weight: 0, // Не обрабатываем, так как с бэка ещё не приходит вес
        complexity: 0
    });

    useEffect(() => {
        setResult((state) => {
            return {
                ...state,
                weight: sortList.reduce((accum, item) => {
                    let isVisible = true;
                    if (filterList?.every((i: any) => i !== item.id)) isVisible = false;
                    return isVisible ? accum + item.weight : accum;
                }, 0),
                complexity: sortList.reduce((accum, item) => {
                    let isVisible = true;
                    if (filterList?.every((i: any) => i !== item.id)) isVisible = false;
                    return isVisible ? accum + item.complexity : accum;
                }, 0),
            }
        });
    }, [sortList]);

    return (
        <div className={`position-relative ${className}`} ref={tableRef}>
            <div className='d-flex flex-row justify-content-start pe-2 ps-2 position-absolute start-0' style={{overflow: 'hidden', top: '-35px'}}>
                <AnimatePresence>
                    {sortValues.some(item => item.value !== null) && sortList.length > 1 && (
                        <motion.div
                            onClick={() => setSort(null, null)}
                            initial={'hidden'}
                            animate={'show'}
                            exit={'hidden'}
                            variants={{
                                hidden: {opacity: 0, y: 100, transition: {duration: 0.5}},
                                show: {opacity: 1, y: 0, transition: {duration: 0.5}}  
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={'clearSortBtn'} role='button'
                        >
                            <i className="ri-close-circle-fill fs-18 me-1" style={{verticalAlign: 'middle'}}></i>
                            cбросить сортировку 
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="TaskTable">
                <div className='TaskTable__headerWrapper'>
                    <div className="TaskTable__header"
    /*                 style={{
                        position: 'fixed',
                        top: headerTop + 'px',
                    }} */
                    >
                        {/* Задача */}
                        { currentRowConfig.includes(TaskTableColumns.titleCell) && (
                            <div className="TaskTable__headerCell">
                                Задача 
                                <svg 
                                    role='button'
                                    style={{
                                        marginLeft: '10px',
                                        verticalAlign: 'middle',
                                        transition: 'all 0.3s',
                                        transform: getRotateSortBtn(SortKeysEnum.name),
                                    }}
                                    onClick={() => handlerSortBtn(SortKeysEnum.name)}
                                    width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.62668 0C10.0459 0 10.279 0.484966 10.0171 0.812347L5.72409 6.17862C5.52393 6.42883 5.14339 6.42883 4.94322 6.17862L0.650203 0.812347C0.388297 0.484965 0.621385 0 1.04064 0L9.62668 0Z" fill="#6C6969" />
                                </svg>
                            </div>
                        )}

                        {/* Сложность */}
                        { currentRowConfig.includes(TaskTableColumns.complexityCell) && (
                            <div className="TaskTable__headerCell">
                                {className !== 'TaskTable_small' && (
                                    <>
                                        Сложность
                                        <svg 
                                            role='button'
                                            style={{
                                                marginLeft: '10px',
                                                verticalAlign: 'middle',
                                                transition: 'all 0.3s',
                                                transform: getRotateSortBtn(SortKeysEnum.complexity),
                                            }}
                                            onClick={() => handlerSortBtn(SortKeysEnum.complexity)}
                                            width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.62668 0C10.0459 0 10.279 0.484966 10.0171 0.812347L5.72409 6.17862C5.52393 6.42883 5.14339 6.42883 4.94322 6.17862L0.650203 0.812347C0.388297 0.484965 0.621385 0 1.04064 0L9.62668 0Z" fill="#6C6969" />
                                        </svg>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Вес */}
                        { currentRowConfig.includes(TaskTableColumns.weightCell) && (
                            <div className="TaskTable__headerCell">
                                Вес
                                {/* <svg 
                                    role='button'
                                    style={{
                                        marginLeft: '10px',
                                        verticalAlign: 'middle',
                                        transition: 'all 0.3s',
                                        transform: getRotateSortBtn(SortKeysEnum.weight),
                                    }}
                                    onClick={() => handlerSortBtn(SortKeysEnum.weight)}
                                    width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.62668 0C10.0459 0 10.279 0.484966 10.0171 0.812347L5.72409 6.17862C5.52393 6.42883 5.14339 6.42883 4.94322 6.17862L0.650203 0.812347C0.388297 0.484965 0.621385 0 1.04064 0L9.62668 0Z" fill="#6C6969" />
                                </svg> */}
                            </div>
                        )}

                        {/* Владелец */}
                        { currentRowConfig.includes(TaskTableColumns.onwerCell) && (
                            <div className="TaskTable__headerCell">
                                Владелец
                                <svg 
                                    role='button'
                                    style={{
                                        marginLeft: '10px',
                                        verticalAlign: 'middle',
                                        transition: 'all 0.3s',
                                        transform: getRotateSortBtn(SortKeysEnum.responsibles),
                                    }}
                                    onClick={() => handlerSortBtn(SortKeysEnum.responsibles)}
                                    width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.62668 0C10.0459 0 10.279 0.484966 10.0171 0.812347L5.72409 6.17862C5.52393 6.42883 5.14339 6.42883 4.94322 6.17862L0.650203 0.812347C0.388297 0.484965 0.621385 0 1.04064 0L9.62668 0Z" fill="#6C6969" />
                                </svg>
                            </div>
                        )}

                        {/* Прогресс */}
                        { currentRowConfig.includes(TaskTableColumns.progressCell) && (
                            <div className="TaskTable__headerCell">
                                Прогресс
                                <svg 
                                    role='button'
                                    style={{
                                        marginLeft: '10px',
                                        verticalAlign: 'middle',
                                        transition: 'all 0.3s',
                                        transform: getRotateSortBtn(SortKeysEnum.progress),
                                    }}
                                    onClick={() => handlerSortBtn(SortKeysEnum.progress)}
                                    width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.62668 0C10.0459 0 10.279 0.484966 10.0171 0.812347L5.72409 6.17862C5.52393 6.42883 5.14339 6.42883 4.94322 6.17862L0.650203 0.812347C0.388297 0.484965 0.621385 0 1.04064 0L9.62668 0Z" fill="#6C6969" />
                                </svg>
                            </div>
                        )}

                        {/* Checkin */}
                        { currentRowConfig.includes(TaskTableColumns.checkinCell) && (
                            <div className="TaskTable__headerCell">
                                Check in
                                <svg 
                                    role='button'
                                    style={{
                                        marginLeft: '10px',
                                        verticalAlign: 'middle',
                                        transition: 'all 0.3s',
                                        transform: getRotateSortBtn(SortKeysEnum.cicreateDate),
                                    }}
                                    onClick={() => handlerSortBtn(SortKeysEnum.cicreateDate)}
                                    width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.62668 0C10.0459 0 10.279 0.484966 10.0171 0.812347L5.72409 6.17862C5.52393 6.42883 5.14339 6.42883 4.94322 6.17862L0.650203 0.812347C0.388297 0.484965 0.621385 0 1.04064 0L9.62668 0Z" fill="#6C6969" />
                                </svg>
                            </div>
                        )}

                        {/* Кнопка открыть карточку задачи */}
                        { currentRowConfig.includes(TaskTableColumns.openTaskCell) && ( 
                            <div className="TaskTable__headerCell"></div>
                        )}
                    </div>
                </div>
                <div className="TaskTable__body TaskTable__body_fill">
                    {sortList.map((item:any , index: number) => {
                        if (taskIDs.indexOf(item.id) !== -1) return '';
                        taskIDs.push(item.id);

                        let isVisible = true;
                        if (filterList?.every((i: any) => i !== item.id)) {
                            isVisible = false;
                        }
                        return (
                            <AnimationListItem key={item.id} index={index}>
                                <TaskItem 
                                    key={item.id}
                                    closeCollapse={closeCollapse} 
                                    changeCloseCollapse={changeCloseCollapse} 
                                    isVisible={isVisible}
                                    viewTable={true}
                                    rowConfig={currentRowConfig}
                                    {...item}
                                    >
                                    <SubTasksList 
                                        filterList={filterList}
                                        applied={applied}
                                        viewTable={true}
                                        namePadding={15}
                                        key={item.id} 
                                        parentId={item.id}
                                        changeCloseCollapse={changeCloseCollapse}
                                        closeCollapse={closeCollapse}
                                        rowConfig={currentRowConfig}
                                    />
                                </TaskItem>
                            </AnimationListItem>
                        )
                    })}

                    {/* Итоги */}
                    {className === 'TaskTable_small' && sortList.length !== 0 && !listLoading && !listError && (
                        <div className="TaskTable__results">
                            <div className='TaskTable__result'></div>
                            <div className='TaskTable__result'>
                                <span className='TaskTable__result-border'></span>
                            </div>
                            <div className='TaskTable__result'>
                                <span className='TaskTable__result-border'>
                                    {`${result.weight}%`}
                                    <div className="TaskTable__result-warning">
                                        {
                                            result.weight < 100 && (
                                                <TooltipWhite
                                                    position='top'
                                                    // Совокупный вес более 100%. Вам необходимо это исправить
                                                    content={'Совокупный вес менее 100%. Это не является критической проблемой'}
                                                >
                                                    {/* F57878 */}
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="#F5BD78" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.85227 7.00268L6.18851 0.670242C5.82665 0.0369989 4.96725 -0.18916 4.33401 0.172694C4.10785 0.308389 3.92692 0.489316 3.83646 0.670242L0.172694 7.00268C-0.18916 7.63592 0.0369989 8.49532 0.670242 8.85718C0.896401 8.99287 1.12256 9.0381 1.34872 9.0381H8.63102C9.39996 9.0381 9.98797 8.40486 9.98797 7.68115C10.0332 7.40976 9.94274 7.1836 9.85227 7.00268ZM5.01248 7.22884C4.74109 7.22884 4.56017 7.04791 4.56017 6.77652C4.56017 6.50513 4.74109 6.3242 5.01248 6.3242C5.28387 6.3242 5.4648 6.50513 5.4648 6.77652C5.4648 7.04791 5.28387 7.22884 5.01248 7.22884ZM5.4648 4.96725C5.4648 5.23864 5.28387 5.41957 5.01248 5.41957C4.74109 5.41957 4.56017 5.23864 4.56017 4.96725V3.15799C4.56017 2.8866 4.74109 2.70567 5.01248 2.70567C5.28387 2.70567 5.4648 2.8866 5.4648 3.15799V4.96725Z"/>
                                                    </svg>
                                                </TooltipWhite>

                                            )
                                        }
                                        
                                    </div>
                                </span>
                            </div>
                            <div className='TaskTable__result'></div>
                            <div className='TaskTable__result'></div>
                        </div>
                    )}

                    {applied && activeList.length > 0 && activeList.every(item => filterList?.every(id => id !== item.id)) && !listLoading && !listError && (
                        <div className={`TaskTable__alert`}>
                            По выбранным фильтрам ничего не найдено
                        </div>      
                    )}
                    {activeList.length == 0 && !listLoading && !listError && (
                        <div className={`TaskTable__alert`}>
                            Тут еще нет задач
                        </div>
                    )}

                    {listError && (
                        <div className={`TaskTable__alert`}>
                            Произошла ошибка: Не смогли загрузить список задач
                        </div>
                    )}

                    {listLoading && (
                        <div className={`TaskTable__alert TaskTable__alert_inColumn p-3`}>
                            <Spinner animation="border" variant="primary" />
                            <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}