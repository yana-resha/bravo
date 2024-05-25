import React, { useEffect, useState } from 'react';
import { CreateTaskModal } from '@/features/CreateTaskModal';
import { DeleteTaskAlert } from '@/features/DeleteTaskAlert';
import { AnimatePresence, motion } from 'framer-motion';
import TaskCard from '@/widgets/TaskCard';
import TitleCell from '../cells/TitleCell';
import './ChildTaskItem.scss';
import { TaskTableColumns } from '../../types';
import { TaskCardTabsID } from '@/widgets/TaskCard/types/tabsTypes';
import { ComplexityCell } from '../cells/ComplexityCell';
import { WeightCell } from '../cells/WeightCell';
import { OwnerCell } from '../cells/OwnerCell';
import { ProgressCell } from '../cells/ProgressCell';
import { CheckinDateCell } from '../cells/CheckinDateCell';
import { CheckinActionCell } from '../cells/CheckinActionCell';
import { OpenTaskCardCell } from '../cells/OpenTaskCardCell';
import { AttentionCell } from '../cells/AttentionCell';
import {CheckINModal} from '@/features/CheckINDragModal/index';
import { useRootTask } from '@/entities/task/utils/getCurrentTaskByRedux';
import { OKRStatusItem } from '@/entities/task/types/OKREnums';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useSelector } from 'react-redux';

type itemProps =  {
    [key: string] : any
    child?: any [],
    children?: React.ReactNode | React.ReactElement,
    closeCollapse?: boolean,
    changeCloseCollapse?: (value: boolean) => void;
    namePadding?: number,
    viewTable?:boolean,
    rowConfig: TaskTableColumns[]
}

export function ChildTaskItem (props: itemProps) {
    const {
        closeCollapse = false,
        changeCloseCollapse = () => {},
        title,
        id,
        isVisible,
        progress,
        statusCheckin,
        responsibles,
        customer,
        rukADLogin,
        complexity,
        taskType,
        children = [],
        chldrn = null,
        rowConfig,
        idParent,
        calcType,
        ciSeen, 
        cicreateDate,
        ciTitle,
        waitfor,
        weight,
        isCheck,
        status,
        startDate,
    } = props;

    const parentTask = useRootTask(id);
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const [taskCollapse, setTaskCollapse] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isCheckINModal, setIsCheckINModal] = useState(false);

    const closeEditModal = () => {
        setShowEditModal(false);
    }

    useEffect(() => {
        if (closeCollapse === true) {
            setTaskCollapse(false);
        }
    }, [closeCollapse]);

    const toggleTaskCollapse = () => {
        setTaskCollapse(!taskCollapse); 
        changeCloseCollapse(false);
    };

    const [isOpenCkList, setIsOpenCkList] = useState<boolean>(false);
    // какую вкладку открыть в карточке задачи
    const [ckListTab, setCkListTab] = useState<TaskCardTabsID|undefined>(undefined);
    const closeCheckINModal = () => {
        setIsCheckINModal(false);
    }
    const isCloseTask = status !== OKRStatusItem.done && status !== OKRStatusItem.cancel ? false : true;
    const isVisibleCheckinButton = (
        parentTask
        && parentTask?.responsibles[0].login !== responsibles[0].login
        && (
            currentUser.login === responsibles[0]?.login
            || currentUser.login === customer?.login 
            || currentUser.login === rukADLogin
        )
    )
    && isCloseTask == false
    && Number(progress) < 100;

    const isDisplayCheckinDate = (
        parentTask
        && parentTask?.responsibles[0].login !== responsibles[0].login
        && (
            currentUser.login === responsibles[0]?.login
            || currentUser.login === customer?.login 
            || currentUser.login === rukADLogin
        )
    );

    return (
        <>
            {isOpenCkList && <TaskCard taskID={id} openTab={ckListTab} isOpen={isOpenCkList} handleOpen={setIsOpenCkList}/>}
            {showDeleteAlert && <DeleteTaskAlert taskType='OKR' id={id} setCloseAlert={() => setShowDeleteAlert(false)}/>}
            {showEditModal && <CreateTaskModal taskID={id} type={taskType} closeFunc={closeEditModal}/> }
            {isCheckINModal && <CheckINModal parentID={idParent} id={id} closeFunc={closeCheckINModal} />}
            <div className={`${isVisible ? "" : "d-none"}`}>
            <AnimatePresence>
                <motion.header>
                    <div className="ChildTaskItem__row">
                        {/* Название задачи */}
                        { rowConfig.includes(TaskTableColumns.titleCell) && (
                            <TitleCell 
                                className="ChildTaskItem__titleCell"
                                hasChildrenTasks={Boolean(chldrn)}
                                taskCollapse={taskCollapse}
                                toggleTaskCollapse={toggleTaskCollapse}
                                title={title}
                            />
                        )}

                        {/* Сложность */}
                        { rowConfig.includes(TaskTableColumns.complexityCell) && (
                            <div className="ChildTaskItem__cell">
                                <ComplexityCell 
                                responsibles={responsibles}
                                complexity={complexity} 
                                statusCheckin={statusCheckin}/>
                            </div>
                        )}

                        {/* Вес */}
                        { rowConfig.includes(TaskTableColumns.weightCell) && (
                            <div className="ChildTaskItem__cell">
                                <WeightCell weight={weight}/>
                            </div>
                        )}

                        {/* Владелец */}
                        { rowConfig.includes(TaskTableColumns.onwerCell) && (
                            <div className="ChildTaskItem__cell ChildTaskItem__responsibeCell ChildTaskItem__responsibeCell_fill">
                                <OwnerCell responsibles={responsibles}/> 
                            </div>
                        )}

                        {/* Прогресс */}
                        { rowConfig.includes(TaskTableColumns.progressCell) && (
                            <div className="ChildTaskItem__cell ChildTaskItem__progress-cell">
                                <ProgressCell calcType={calcType} progress={progress}/>
                            </div>
                        )}

                        {/* Checkin */}
                        { rowConfig.includes(TaskTableColumns.checkinCell) && (
                            <div className="ChildTaskItem__cell" >
                                {isDisplayCheckinDate && (
                                    <CheckinDateCell 
                                        cicreateDate={cicreateDate}
                                        startDate={startDate}
                                        progress={progress}
                                    />
                                )}
                            </div>
                        )}
                        
                        {/* Управление Checkin */}
                        { rowConfig.includes(TaskTableColumns.controlCheckinCell) && (
                            <div className='ChildTaskItem__cell' style={{justifyContent: 'start'}}>
                                <CheckinActionCell 
                                    startDate={startDate}
                                    progress={progress}
                                    customer={customer}
                                    director={rukADLogin}
                                    ciSeen={ciSeen}
                                    responsibles={responsibles}
                                    ciTitle={ciTitle}
                                    openCheckinModal={() => setIsCheckINModal(true)}
                                    cicreateDate={cicreateDate} 
                                    openTaskCheckinCard={() => {
                                        setCkListTab(TaskCardTabsID.checkin);
                                        setIsOpenCkList(true);
                                    }}
                                />
                            </div>
                        )
                        }

                        {/* Кол-во задач требуемых внимания */}
                        { rowConfig.includes(TaskTableColumns.attentionCell) && (
                            <div className="ChildTaskItem__cell ChildTaskItem__actions">
                                <AttentionCell 
                                waitfor={waitfor}
                                responsibles={responsibles}
                                openAttentionCard={() => {
                                    setCkListTab(TaskCardTabsID.approvals);
                                    setIsOpenCkList(true);
                                }}
                                />
                            </div>
                        )}

                        {/* Кнопка Открыть карточку задачи */}
                        { rowConfig.includes(TaskTableColumns.openTaskCell) && (
                            <OpenTaskCardCell openTaskCard={() => {
                                setCkListTab(undefined);
                                setIsOpenCkList(true);
                            }}
                            />
                        )}
                    </div>
                </motion.header>
            
                { taskCollapse && (
                    <motion.section
                        key={'content'}
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        style={{ overflow: 'hidden' }}
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <motion.div
                            variants={{ collapsed: { y: -100 }, open: { y: 0 } }}
                            transition={{ duration: 0.8 }}
                        >
                            {children}
                        </motion.div>
                    </motion.section>
                )}
            </AnimatePresence>
            </div>
        </>
    )
}

export default ChildTaskItem;
