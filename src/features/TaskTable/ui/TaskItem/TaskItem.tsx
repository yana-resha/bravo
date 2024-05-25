/* React & Hooks */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/* Features */
import { DeleteTaskAlert } from '@/features/DeleteTaskAlert';
import {CheckINModal} from '@/features/CheckINDragModal/index'


/* Types */
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { TaskTableColumns } from '../../types';

/* Styles */
import './TaskItem.scss';

/* Utils */
import { AnimatePresence, motion } from 'framer-motion';
import TaskCard from '@/widgets/TaskCard';
import TitleCell from '../cells/TitleCell';
import { TaskCardTabsID } from '@/widgets/TaskCard/types/tabsTypes';
import { CreateOKRTaskModal } from '@/features/CreateOKRTaskModal';
import { ComplexityCell } from '../cells/ComplexityCell';
import { WeightCell } from '../cells/WeightCell';
import { OwnerCell } from '../cells/OwnerCell';
import { ProgressCell } from '../cells/ProgressCell';
import { CheckinDateCell } from '../cells/CheckinDateCell';
import { CheckinActionCell } from '../cells/CheckinActionCell';
import { OpenTaskCardCell } from '../cells/OpenTaskCardCell';
import { AttentionCell } from '../cells/AttentionCell';
import { findCurrentTask } from '@/entities/task/utils/getCurrentTaskByRedux';
import { OKRStatusItem } from '@/entities/task/types/OKREnums';


type OKRItemProps = OKRItemType & {
    [key:string]: any,
    children?: React.ReactNode | React.ReactElement,
    closeCollapse?: boolean,
    changeCloseCollapse?: (value: boolean) => void,
    isVisible?: boolean,
    viewTable?:boolean,
    rowConfig: TaskTableColumns[]
}

export function TaskItem (item: OKRItemProps) {
    const {
        closeCollapse = false,
        changeCloseCollapse = () => {},
        title,
        id,
        progress,
        statusCheckin,
        responsibles,
        customer,
        rukADLogin,
        ciSeen, 
        cicreateDate,
        ciTitle,
        complexity,
        children = [],
        isVisible = true,
        calcType,
        rowConfig,
        waitfor,
        idParent,
        description,
        isCheck,
        status,
        startDate,
    } = item;

    const [taskCollapse, setTaskCollapse] = useState(false);
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isCheckINModal, setIsCheckINModal] = useState(false);

    
    const closeEditModal = () => {
        setShowEditModal(false);
    }

    const closeCheckINModal = () => {
        setIsCheckINModal(false);      
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
    const [ckListTab, setCkListTab] = useState<TaskCardTabsID|undefined>(undefined);
    const parentTask = idParent ? findCurrentTask(idParent) : null;
    const isCloseTask = status !== OKRStatusItem.done && status !== OKRStatusItem.cancel ? false : true;
    
    const isDisplayCheckinButton = (
        currentUser.login === responsibles[0]?.login
        || currentUser.login === customer?.login 
        || currentUser.login === rukADLogin
    )
    && isCloseTask == false
    && Number(progress) < 100;

    const isDisplayCheckinDate = (
        currentUser.login === responsibles[0]?.login
        || currentUser.login === customer?.login 
        || currentUser.login === rukADLogin
    );
    
    return (
        <>
            {isOpenCkList && (<TaskCard taskID={id} openTab={ckListTab} isOpen={isOpenCkList} handleOpen={setIsOpenCkList}/>)}
            {showDeleteAlert && <DeleteTaskAlert taskType='OKR' id={id} setCloseAlert={() => setShowDeleteAlert(false)}/>}
            {showEditModal && 
                <CreateOKRTaskModal 
                editTask={item}
                closeFunc={() => setShowEditModal(false)}
                />
            }

            {isCheckINModal && <CheckINModal id={id} closeFunc={closeCheckINModal} />}

            <div className={`TaskItem__container TaskItem__container_fill ${isVisible ? "" : "d-none"}`}>
                <AnimatePresence>
                    <motion.header>
                        <div className="TaskItem__row">
                            {/* Задача */}
                            { rowConfig.includes(TaskTableColumns.titleCell) && (
                                <TitleCell 
                                    hasChildrenTasks={Boolean(item.chldrn)}
                                    taskCollapse={taskCollapse}
                                    toggleTaskCollapse={toggleTaskCollapse}
                                    title={title}
                                />
                            )}

                            {/* Сложность */}
                            { rowConfig.includes(TaskTableColumns.complexityCell) && (
                                <div className={`TaskItem__cell`}>
                                    <ComplexityCell 
                                    responsibles={responsibles}
                                    complexity={complexity} 
                                    statusCheckin={statusCheckin}/>
                                </div>
                            )}

                            {/* Вес */}
                            { rowConfig.includes(TaskTableColumns.weightCell) && (
                                <div className={`TaskItem__cell`}>
                                    {
                                        item.idParent && (
                                            <WeightCell weight={item.weight}/>
                                        )
                                    }
                                </div>
                            )}

                            {/* Владелец */}
                            { rowConfig.includes(TaskTableColumns.onwerCell) && (
                                <div className={`TaskItem__cell TaskItem__responsibleCell TaskItem__responsibleCell_fill`}>
                                    <OwnerCell responsibles={responsibles}/>
                                </div>
                            )}

                            {/* Прогресс */}
                            { rowConfig.includes(TaskTableColumns.progressCell) && (
                                <div className={`TaskItem__cell TaskItem__progress-cell`}>
                                    <ProgressCell calcType={calcType} progress={progress}/>
                                </div>
                            )}

                            {/* Checkin */}
                            { rowConfig.includes(TaskTableColumns.checkinCell) && (
                                <div className="TaskItem__cell">
                                    {isDisplayCheckinDate && 
                                        <CheckinDateCell
                                            cicreateDate={item.cicreateDate}
                                            startDate={item.startDate}
                                            progress={item.progress}
                                        />
                                    }
                                </div>
                            )}

                            {/* Управление Chekin */}
                            { rowConfig.includes(TaskTableColumns.controlCheckinCell) && (
                                <div className='TaskItem__cell' style={{justifyContent: 'start'}}>
                                    <CheckinActionCell
                                        startDate={startDate}
                                        progress={progress}
                                        ciSeen={ciSeen}
                                        responsibles={responsibles}
                                        customer={customer}
                                        director={rukADLogin}
                                        ciTitle={ciTitle}
                                        openCheckinModal={() => isDisplayCheckinButton && setIsCheckINModal(true)}
                                        cicreateDate={cicreateDate} 
                                        openTaskCheckinCard={() => {
                                            setCkListTab(TaskCardTabsID.checkin);
                                            setIsOpenCkList(true);
                                        }}
                                    />
                                </div>
                            )}

                            {/* Кол-во задач требуемых внимания */}
                            { rowConfig.includes(TaskTableColumns.attentionCell) && (
                                <div className={`TaskItem__cell TaskItem__cellTaskAction`}>
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

                            {/* Кнопка "Открыть карточку задачи" */}
                            { rowConfig.includes(TaskTableColumns.openTaskCell) && (
                                <div className={'TaskItem__cell TaskItem__cell_openCard'}>
                                    <OpenTaskCardCell openTaskCard={() => {
                                        setCkListTab(undefined);
                                        setIsOpenCkList(true);
                                    }}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.header>

                    {taskCollapse && (
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
                                variants={{ collapsed: { y: 100 }, open: { y: 0 } }}
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
