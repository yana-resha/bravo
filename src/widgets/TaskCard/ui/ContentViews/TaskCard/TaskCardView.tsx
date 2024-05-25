import { AvatarGroup } from "@/shared/ui/Avatar/ui/AvatarGroup";
import { AvatarItem } from "@/shared/ui/Avatar/ui/AvatarItem";
import { Button } from "@/shared/ui/Button";
import CloseModalBtn from "@/shared/ui/CloseModalBtn";
import cl from './TaskCard.module.scss';
import '../../TaskCard.scss';
import '../../CheckinList.scss';
import { CustomProgressBar } from "@/shared/ui/CustomProgressBar";
import { StarList } from "@/shared/ui/StarList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import getCheckinStatusColor from "@/entities/checkIn/utils/getCheckinStatusColor";
import { getFIOShort } from "@/shared/lib/getFIOShort";
import getProgressPlanColor from "@/entities/task/utils/getProgressPlanColor";
import { useCurrentTasks } from "@/entities/task/libs/hooks/useCurrentTasks";
import moment from "moment";
import { TaskTable } from "@/features/TaskTable/ui/TaskTable/TaskTable";
import { AnimatePresence, motion } from "framer-motion";
import { TaskTableColumns } from "@/features/TaskTable/types";
import { RequestSuccesTaskModal } from "@/features/RequestSuccesTaskModal";
import { EditDeadlineTaskModall } from "@/features/EditDeadlineTaskModal";
import { EditComplexityTaskModal } from "@/features/EditComplexityTaskModal";
import { CalculationMechanicsModal } from "@/features/CalculationMechanicsModal";

import { Form } from "react-bootstrap";
import { Badge } from "@/shared/ui/Badge";
import { bgThemeEnum } from "@/shared/ui/Badge/types/badgeProps";
import { showInfoAlert } from "@/shared/utils/showInfoAlert";
import { useDispatch } from "react-redux";
import { OKRItemUpdateRequest } from "@/entities/task/types/OKRItemRequestType";
import taskService from "@/entities/task/services/TaskService";
import { updateOKRTask } from "@/entities/task/model/slices/okrListSlice";
import { updateChildTask } from "@/entities/task/model/slices/childTaskSlice";
import { OKRStatusItem } from "@/entities/task/types/OKREnums";
import { CreateOKRChildTaskModal } from "@/features/CreateOKRChildTaskModal";

type TaskProps = {
    isShow: boolean,
    taskID: string,
    closeModalFunc: () => void,
    task: OKRItemType,   
}

export function TaskCardView({ isShow, taskID, closeModalFunc, task }: TaskProps) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const {
        title,
        weight,
        description,
        complexity = 0,
        statusCheckin, 
        status,
        strategyTitle,
        responsibles,
        progress = 0,
        dueDate,
        startDate,
        createDate,
        business,
        tags,
        calcType,
        chldrn,
        idParent,
        customer
    } = task;


    const {tasksList, setLoadTasks, isLoadingTasklist, errorTaskList} = useCurrentTasks(taskID, currentUser.login);
    const childTasksResponsible = getUniqChildTaskResps();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showChangeComplexityModal, setShowChangeComplexityModal] = useState(false);

    const [showRequestSuccesModal, setShowRequestSuccesModal] = useState(false);
    const [showChangeDeadlineModal, setShowChangeDeadlineModal] = useState(false);
    const [showCalculationMechanicsModal, setShowCalculationMechanicsModal] = useState(false);
    const [taskIsClose, setTaskIsClose] = useState<boolean>(false);
    
    useEffect(() => {
        setTaskIsClose(status !== OKRStatusItem.done && status !== OKRStatusItem.cancel ? false : true)
    }, [status])
    
    const [checkedProgress, setCheckedProgress] = useState(Boolean(+calcType));
    const childTasksRowConfig = [
        TaskTableColumns.titleCell,
        TaskTableColumns.complexityCell,
        TaskTableColumns.weightCell,
        TaskTableColumns.onwerCell,
        TaskTableColumns.progressCell,
        TaskTableColumns.checkinCell,
        TaskTableColumns.openTaskCell
    ];

    // ---------------------------------------
    // Условия показа кнопок
    const isDisplayEditComplexityButton = responsibles.some(el => el.login === currentUser.login)
        && customer?.login !== currentUser.login
        && taskIsClose == false;

    const isDisplayEditDedlineButton = responsibles.some(el => el.login === currentUser.login)
        && customer?.login !== currentUser.login
        && taskIsClose == false;
    // ---------------------------------------


    function getUniqChildTaskResps ()  {
        const flags: {[key: string]: any} = {};
        let newArr = tasksList.filter((entry) => {
            if (entry.responsibles[0]) {
                if (flags[`${entry.responsibles[0].login}`]) {
                    return false;
                }
                flags[`${entry.responsibles[0].login}`] = true;
                return true;
            }
        }).map(el => el.responsibles[0]);
        return newArr;
    }

    useEffect(() => {
        if (tasksList.length == 0) {
            setLoadTasks(true);
        }
    }, []);

    const toggleCalculationMechanicsMode = async (isManual: boolean) => {
        const request: OKRItemUpdateRequest = {
            login: currentUser.login, 
            id: taskID, 
            calcType: isManual ? 1 : 0,
        }

        await taskService.updateOKR(request)
            .then((response) => {
                if (response) {
                    dispatch(updateOKRTask({ id: taskID, calcType: response.calcType }));
                    dispatch(updateChildTask({ id: taskID, calcType: response.calcType }));
                    setCheckedProgress(Boolean(+response.calcType));
                }
            })
            .catch(() => {
                showInfoAlert({
                    type: 'error',
                    text: `Не смогли изменить режим расчета, ошибка сервера`,
                    format: 'mini',
                });
            })
    }


    return (
        <>
            {showCalculationMechanicsModal && 
                <CalculationMechanicsModal 
                    closeFunc={() => setShowCalculationMechanicsModal(false)} 
                />
            }

            {/* добавить дочернюю задачу */}
            {showAddModal &&
                <CreateOKRChildTaskModal
                parentTask={task}
                closeFunc={() => setShowAddModal(false)}
                />
            }
                
            {/* Запрос на изменение сложности */}
            {showChangeComplexityModal &&
                <EditComplexityTaskModal 
                    currentValue={complexity ?? 0} 
                    taskName={title}
                    taskID={taskID}
                    closeFunc={() => setShowChangeComplexityModal(false)} 
                />
            }

            {/* Запрос на изменение дедлайна */} 
            {showChangeDeadlineModal && 
                <EditDeadlineTaskModall 
                    taskID={taskID}
                    taskName={title}
                    startDate={startDate}
                    dueDate={dueDate} 
                    closeFunc={() => setShowChangeDeadlineModal(false)} 
                />
            }
            

            <AnimatePresence>
                <motion.div 
                    className={`TaskCard__tab`}
                    animate={isShow ? "show" : "hide"}
                    transition={{ duration: 0.5,}}
                    initial={"hide"}
                    variants={{
                        show: {
                            x: 0,
                            opacity: 1,
                            display: 'block',
                        },
                        hide: {
                            x: -100,
                            opacity: 0,
                            display: 'none',
                        }
                    }}
                >
                    

                    <div className="TaskCard__itemData">
                        <div className="TaskCard__itemDataLabel">Описание</div>
                        <div className="TaskCard__itemDataContent">
                        {description?.replace(/<[^>]+>/g, '').length
                            ? (
                                <div
                                    dangerouslySetInnerHTML={{ __html: description}}
                                />
                            ) 
                            :'Описание не заполнено'
                        }
                        </div>
                    </div>

                    <div className="TaskCard__row TaskCard__row_3col">
                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel d-flex flex-row">
                                Прогресс
                                {
                                    // Временно скрываем!
                                    // chldrn && chldrn > 0 &&
                                    // <div className="d-flex flex-row align-items-center flex-nowrap ms-4">
                                    //     {/* <span className={`${cl.progressSwitchLabel}`} title="Ручной">Р</span> */}
                                    //     <div className="ps-2 pe-2">
                                    //         <Form.Check // prettier-ignore
                                    //             type="switch"
                                    //             checked={checkedProgress}
                                    //             onChange={(e) => toggleCalculationMechanicsMode(e.target.checked)}
                                    //         />
                                    //     </div>
                                    //     <span className={`${cl.progressSwitchLabel} position-relative`} title="Автоматический"> 
                                    //         А
                                    //         <Button
                                    //             className={`${cl.infoBtn}`}
                                    //             onClick={() => setShowCalculationMechanicsModal(true)}
                                    //             onlyIcon
                                    //         >
                                    //             <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    //                 <path fillRule="evenodd" clipRule="evenodd" d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10ZM6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" fill="#6F767E" />
                                    //                 <path fillRule="evenodd" clipRule="evenodd" d="M6 5C6.27614 5 6.5 5.22386 6.5 5.5V8.00044C6.5 8.27658 6.27614 8.50044 6 8.50044C5.72386 8.50044 5.5 8.27658 5.5 8.00044V5.5C5.5 5.22386 5.72386 5 6 5Z" fill="#6F767E" />
                                    //                 <circle cx="6" cy="4" r="0.5" fill="#6F767E" />
                                    //             </svg>
                                    //         </Button>
                                    //     </span>
                                    // </div>
                                }
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <div className={`${cl.progressContainer}`}>
                                    <CustomProgressBar
                                        status={dueDate && startDate ? getProgressPlanColor(progress??0, new Date(moment(dueDate, 'DD.MM.YYYY').format('YYYY-MM-DD')), new Date(moment(startDate, 'DD.MM.YYYY').format('YYYY-MM-DD'))).color : 'success'}
                                        completed={progress??0}
                                        maxCompleted={100}
                                        height='6px'
                                        borderRadius='2px'
                                        withIcon={false}
                                        showLabel={true}
                                        subfix="%"
                                        passingScore={progress < 100 && dueDate && startDate ? getProgressPlanColor(progress??0, new Date(moment(dueDate, 'DD.MM.YYYY').format('YYYY-MM-DD')), new Date(moment(startDate, 'DD.MM.YYYY').format('YYYY-MM-DD'))).planValue :undefined}
                                    />
                                </div>
                            </div>
                        </div>
                        {
                            task.idParent && (
                                <div className="TaskCard__itemData">
                                    <div className="TaskCard__itemDataLabel">Вес</div>
                                    <div className="TaskCard__itemDataContent">{`${weight || 0}%`}</div>
                                </div>
                                
                            )
                        }

                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel">
                                Сложность
                                {isDisplayEditComplexityButton && (
                                    <Button onlyIcon title="Редактировать сложность" className="ms-2" onClick={() => setShowChangeComplexityModal(true)}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.909 2.15901L5.46967 8.59835C5.32902 8.739 5.25 8.92977 5.25 9.12868V12.1287C5.25 12.5429 5.58579 12.8787 6 12.8787H9C9.19891 12.8787 9.38968 12.7997 9.53033 12.659L15.9697 6.21967C16.8484 5.34099 16.8484 3.91637 15.9697 3.03769L15.091 2.15901C14.2123 1.28033 12.7877 1.28033 11.909 2.15901ZM14.909 4.09835L14.9714 4.169C15.2002 4.46322 15.1794 4.88865 14.909 5.15901L8.688 11.3787H6.75V9.43918L12.9697 3.21967C13.2626 2.92678 13.7374 2.92678 14.0303 3.21967L14.909 4.09835ZM8.27311 3.12891C8.27311 2.71469 7.93732 2.37891 7.52311 2.37891H4.5L4.33733 2.38237C2.34173 2.46754 0.75 4.11234 0.75 6.12891V13.6289L0.753465 13.7916C0.838636 15.7872 2.48343 17.3789 4.5 17.3789H12L12.1627 17.3754C14.1583 17.2903 15.75 15.6455 15.75 13.6289V9.94017L15.745 9.85271C15.7016 9.4797 15.3846 9.19017 15 9.19017C14.5858 9.19017 14.25 9.52596 14.25 9.94017V13.6289L14.2462 13.7611C14.1777 14.9422 13.1983 15.8789 12 15.8789H4.5L4.3678 15.8751C3.18669 15.8067 2.25 14.8272 2.25 13.6289V6.12891L2.25382 5.9967C2.32225 4.8156 3.30174 3.87891 4.5 3.87891H7.52311L7.61058 3.87386C7.98358 3.83054 8.27311 3.51353 8.27311 3.12891Z" fill="#B3B8BF"/>
                                        </svg>
                                    </Button>
                                )}
                            </div>
                            <div className="TaskCard__itemDataContent">
                                { complexity &&  complexity > 0 
                                        ?  <StarList value={complexity} status={statusCheckin ? getCheckinStatusColor(statusCheckin) : 'default'} /> 
                                        : 'Не установлена'
                                }
                            </div>
                        </div>
                    </div>

                    <div className="TaskCard__row TaskCard__row_3col">
                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel">Стратегическая цель</div>
                            <div className="TaskCard__itemDataContent">{strategyTitle ?? 'Нет привязки'}</div>
                        </div>
                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel">Направление бизнеса</div>
                            <div className="TaskCard__itemDataContent">{business ? business :'Не установлено'}</div>
                        </div>
                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel">Хэштеги</div>
                            <div className="TaskCard__itemDataContent">
                                
                                {tags && tags.length > 0 && (
                                    tags.map(tag => {
                                        return (
                                            <Badge className="me-1" theme={bgThemeEnum.lightGrey}>{tag}</Badge>
                                        )
                                    })
                                )
                                }
                                {(!tags || tags.length == 0) && (
                                    'Не установлено'
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="TaskCard__row TaskCard__row_3col">
                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel">Владелец</div>
                            <div className="TaskCard__itemDataContent d-flex flex-nowrap align-items-center flex-row">
                                <span className="me-2"><AvatarItem {...responsibles[0]}></AvatarItem></span>
                                {getFIOShort(responsibles[0].fio??"")}
                            </div>
                        </div>
                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel">Ответственные за подзадачи</div>
                            <div className="TaskCard__itemDataContent">
                                {
                                    childTasksResponsible.length > 0 
                                    ? <AvatarGroup items={childTasksResponsible} maxLength={5}/>
                                    : 'Нет подзадач'
                                }
                            </div>
                        </div>
                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel">Заказчик</div>
                            <div className="TaskCard__itemDataContent d-flex flex-nowrap align-items-center flex-row">
                                <span className="me-2">
                                    <AvatarItem login={customer?.login??null} avatar={customer?.avatar??null} fio={customer?.fio??"Не назначен"}></AvatarItem>
                                </span>
                                {customer?.fio ? getFIOShort(customer.fio) : 'Не назначен'}
                            </div>
                        </div>
                    </div>

                    <div className="TaskCard__row TaskCard__row_3col">
                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel">Создана</div>
                            <div className="TaskCard__itemDataContent">
                                {createDate ? moment(createDate, 'DD.MM.YYYY').locale('ru').format('MMM DD, YYYY') : 'Не установлен'}
                            </div>
                        </div>
                        {startDate && startDate !== createDate && (
                            <div className="TaskCard__itemData">
                                <div className="TaskCard__itemDataLabel">Дата начала работы</div>
                                <div className="TaskCard__itemDataContent">
                                    { moment(startDate, 'DD.MM.YYYY').locale('ru').format('MMM DD, YYYY') }
                                </div>
                            </div>
                        )}
                        <div className="TaskCard__itemData">
                            <div className="TaskCard__itemDataLabel">
                                Дедлайн
                                {isDisplayEditDedlineButton && (
                                    <Button onlyIcon title="Редактировать дедлайн" onClick={() => setShowChangeDeadlineModal(true)} className="ms-2" >
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M11.909 2.15901L5.46967 8.59835C5.32902 8.739 5.25 8.92977 5.25 9.12868V12.1287C5.25 12.5429 5.58579 12.8787 6 12.8787H9C9.19891 12.8787 9.38968 12.7997 9.53033 12.659L15.9697 6.21967C16.8484 5.34099 16.8484 3.91637 15.9697 3.03769L15.091 2.15901C14.2123 1.28033 12.7877 1.28033 11.909 2.15901ZM14.909 4.09835L14.9714 4.169C15.2002 4.46322 15.1794 4.88865 14.909 5.15901L8.688 11.3787H6.75V9.43918L12.9697 3.21967C13.2626 2.92678 13.7374 2.92678 14.0303 3.21967L14.909 4.09835ZM8.27311 3.12891C8.27311 2.71469 7.93732 2.37891 7.52311 2.37891H4.5L4.33733 2.38237C2.34173 2.46754 0.75 4.11234 0.75 6.12891V13.6289L0.753465 13.7916C0.838636 15.7872 2.48343 17.3789 4.5 17.3789H12L12.1627 17.3754C14.1583 17.2903 15.75 15.6455 15.75 13.6289V9.94017L15.745 9.85271C15.7016 9.4797 15.3846 9.19017 15 9.19017C14.5858 9.19017 14.25 9.52596 14.25 9.94017V13.6289L14.2462 13.7611C14.1777 14.9422 13.1983 15.8789 12 15.8789H4.5L4.3678 15.8751C3.18669 15.8067 2.25 14.8272 2.25 13.6289V6.12891L2.25382 5.9967C2.32225 4.8156 3.30174 3.87891 4.5 3.87891H7.52311L7.61058 3.87386C7.98358 3.83054 8.27311 3.51353 8.27311 3.12891Z" fill="#B3B8BF"/>
                                        </svg>
                                    </Button>
                                )}
                            </div>
                            <div className="TaskCard__itemDataContent">
                                {dueDate ? moment(dueDate, 'DD.MM.YYYY').locale('ru').format('MMM DD, YYYY') : 'Не установлен'}
                            </div>
                        </div>
                    </div>

                    <div className="TaskCard__row">
                        <div>
                            <div>
                                <div className="TaskCard__itemData d-flex flex-row align-items-center flex-nowrap">
                                    <div className="TaskCard__itemDataLabel m-0 me-3">Дочерние задачи</div>
                                    {
                                        taskIsClose == false && (

                                            <Button 
                                                onClick={() => setShowAddModal(true)}
                                                borderRadius="pill" 
                                                color="primary" 
                                                className={cl.addBtn}
                                            >
                                                <svg className="me-1" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.99327 1.47773C7.93551 1.02184 7.51284 0.667969 7 0.667969C6.44772 0.667969 6 1.07837 6 1.58464V6.16797H1L0.883379 6.17414C0.38604 6.22709 0 6.61454 0 7.08464C0 7.5909 0.447715 8.0013 1 8.0013H6V12.5846L6.00673 12.6915C6.06449 13.1474 6.48716 13.5013 7 13.5013C7.55228 13.5013 8 13.0909 8 12.5846V8.0013H13L13.1166 7.99514C13.614 7.94218 14 7.55474 14 7.08464C14 6.57837 13.5523 6.16797 13 6.16797H8V1.58464L7.99327 1.47773Z" fill="white" />
                                                </svg>
                                                Добавить
                                            </Button>

                                        )
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="positon-relative pt-3">
                        <TaskTable 
                            className="TaskTable_small"
                            activeList={tasksList}
                            listLoading={isLoadingTasklist}
                            listError={errorTaskList}
                            applied={false} 
                            filterList={undefined}
                            rowConfig={childTasksRowConfig}    
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    )
}