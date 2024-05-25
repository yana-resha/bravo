/* React & Redux */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

/* Types */
import { OKRReduxListTypes } from "@/entities/task/model/slices/okrListSlice";
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';

/* Features */
import {CheckINModal} from '@/features/CheckINDragModal/index';
import { RequestCancelTaskModal } from "@/features/RequestCancelTaskModal";

/* Components */
import { Button } from '@/shared/ui/Button';
import { Sidebar } from '@consta/uikit/Sidebar';
import { TooltipWhite } from "@/shared/ui/TooltipWhite";
import CheckinCard from "./ContentViews/CheckinCard";
import TaskCardView from "./ContentViews/TaskCard";
import ListApprovalsCard from "./ContentViews/ListApprovalsCard";


/* Styles */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CheckinList.scss';
import './TaskCard.scss';
import { OKRStatusItem } from '@/entities/task/types/OKREnums';
import { getWeekYearFromDate } from '@/shared/utils/getWeekYearFromDate';
import { TabType, TaskCardTabsID} from '../types/tabsTypes';
import { fetchApprovalsList } from '@/entities/request/model/slices/approvalsSlice';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { UpdateRequest } from '@/entities/request';
import { RequestSuccesTaskModal } from '@/features/RequestSuccesTaskModal';
import { CreateOKRChildTaskModal } from '@/features/CreateOKRChildTaskModal';
import { CreateOKRTaskModal } from '@/features/CreateOKRTaskModal';
import { CancelTaskByDirectorModal } from '@/features/CancelTaskByDirectorModal';
import CloseModalBtn from '@/shared/ui/CloseModalBtn';
import { findCurrentTask, useRootTask } from '@/entities/task/utils/getCurrentTaskByRedux';
import { ComplateTaskModal } from '@/features/ComplateTaskModal';

type CheckinListPropsType = {
    taskID: string,
    isOpen: boolean,
    handleOpen: Function,
    openTab?: TaskCardTabsID,
}

export const TaskCard = ({ taskID, isOpen = false, handleOpen, openTab = TaskCardTabsID.card}: CheckinListPropsType) => {
    
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const inconsistentApprovalsCount = useSelector((state: StoreReducerType) => state
        .approvalsList.list.filter((item: UpdateRequest) => item.status === null).length);
    const [reloadList, setReloadList] = useState(false);
    let taskItem: OKRItemType = findCurrentTask(taskID);
    // const parentTask = useSelector((state: StoreReducerType) => state.okrList?.inprogressList?.list
    //     .find((task: OKRItemType) => task.id === taskItem.idParent));
    const parentTask = taskItem.idParent ? findCurrentTask(taskItem.idParent) : undefined;
    const rootTask = useRootTask(taskID);
    const isCloseTask = taskItem.status !== OKRStatusItem.done && taskItem.status !== OKRStatusItem.cancel ? false : true;
    const isNewCheckin = taskItem.cicreateDate && getWeekYearFromDate(null) == getWeekYearFromDate(taskItem.cicreateDate);
    const isCurrentUserSupervisor = taskItem.rukADLogin === currentUser.login;

    // ---------------------------------------
    // Условия показа кнопок
    
    const isDisplayCheckinButton = (
        rootTask.id === taskItem.id
            ? (
                (taskItem.responsibles[0].login === currentUser.login)
                && !isCloseTask
                && taskItem.progress < 100
            )
            : (
                (rootTask?.responsibles[0].login !== taskItem.responsibles[0].login)
                && (taskItem.responsibles[0].login === currentUser.login)
                && !isCloseTask
                && taskItem.progress < 100
            )
        
    );
    
    const isDisplayComplateTaskButton = (
        taskItem.responsibles.some(el => el.login === currentUser.login)
        || taskItem.customer?.login === currentUser.login
        || taskItem.rukADLogin === currentUser.login
    ) && isCloseTask == false;

    const isDisplayEditButton = (
        taskItem.rukADLogin === currentUser.login
        || taskItem.customer?.login === currentUser.login
    ) && isCloseTask == false;

    const isDisplayCancelTask = (
        currentUser.login === taskItem.responsibles[0]?.login
        || currentUser.login === taskItem.customer?.login 
        || currentUser.login === taskItem.rukADLogin
    ) && isCloseTask == false;

    const isDisplayApprovalsTab = (
        currentUser.login === taskItem.responsibles[0]?.login
        || currentUser.login === taskItem.customer?.login 
        || currentUser.login === taskItem.rukADLogin
    );

    const isDisplayCheckinTab = (
        currentUser.login === taskItem.responsibles[0]?.login
        || currentUser.login === taskItem.customer?.login 
        || currentUser.login === taskItem.rukADLogin
    );
    // ---------------------------------------

    const [showCheckinModal, setShowCheckinModal] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(isOpen)
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    const [showRequestSuccesModal, setShowRequestSuccesModal] = useState(false);
    const [showComplateTaskModal, setShowComplateTaskModal] = useState(false);

    const [showCancelModal, setShowRequestCancelModal] = useState(false);
    const [showDirectorCancelModal, setShowDirectorCancelModal] = useState(false);

    const [tabs, setActiveTab] = useState<TabType[]>([
        {
            id: TaskCardTabsID.card,
            label: 'Карточка задачи',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19 4H5C2.79086 4 1 5.79086 1 8V9V16C1 18.2091 2.79086 20 5 20H19C21.2091 20 23 18.2091 23 16V9V8C23 5.79086 21.2091 4 19 4ZM21 8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8H21ZM3 10H21V16C21 17.1046 20.1046 18 19 18H5C3.89543 18 3 17.1046 3 16V10ZM19 15C19 14.4477 18.5523 14 18 14H15L14.8834 14.0067C14.386 14.0645 14 14.4872 14 15C14 15.5523 14.4477 16 15 16H18L18.1166 15.9933C18.614 15.9355 19 15.5128 19 15ZM12 14C12.5523 14 13 14.4477 13 15C13 15.5128 12.614 15.9355 12.1166 15.9933L12 16H11C10.4477 16 10 15.5523 10 15C10 14.4872 10.386 14.0645 10.8834 14.0067L11 14H12Z" fill="#3F8CFF"/></svg>,
            active: false,
        },

        {
            id: TaskCardTabsID.checkin,
            label: 'Check-in',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19 1H5C2.79086 1 1 2.79086 1 5V10C1 14.3666 3.65957 18.1686 8.83853 21.3794C10.7752 22.58 13.2248 22.58 15.1615 21.3794L15.5314 21.1463C20.4685 17.983 23 14.2589 23 10V5C23 2.79086 21.2091 1 19 1ZM5 3H19C20.1046 3 21 3.89543 21 5V10C21 13.4932 18.8637 16.636 14.4587 19.4583L14.1014 19.6834C12.8165 20.4799 11.1835 20.4799 9.89235 19.6795C5.25072 16.8019 3 13.5843 3 10V5C3 3.89543 3.89543 3 5 3ZM17.7133 6.29031C17.3229 5.89968 16.6897 5.89951 16.2991 6.28993L11 11.585L8.71133 9.2921L8.61719 9.20883C8.22516 8.90348 7.6579 8.93073 7.29712 9.29091C6.90627 9.68111 6.90574 10.3143 7.29593 10.7051L10.2923 13.7065L10.3865 13.7898C10.7787 14.0953 11.3462 14.0678 11.7069 13.7073L17.7129 7.70452L17.7961 7.61034C18.1013 7.21813 18.0737 6.65089 17.7133 6.29031Z" fill="#3F8CFF"/></svg>,
            active: false,
        },

        {
            id: TaskCardTabsID.approvals,
            label: 'Согласования и логи',
            icon:<svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.88867 6.45117H18.1109" stroke="#3F8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.88867 11.9062H10.7776" stroke="#3F8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 3.72641V25.2554C1 25.8626 1.65825 26.1667 2.04323 25.7373L6.75313 20.4842C6.98234 20.2286 7.29322 20.0849 7.61737 20.0849H20.5556C21.9056 20.0849 23 18.8643 23 17.3585V3.72641C23 2.22066 21.9056 1 20.5556 1H3.44444C2.09441 1 1 2.22066 1 3.72641Z" stroke="#3F8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>,
            active: false,
            count: 0
        },
    ]);

    useEffect(() => {
        dispatch(fetchApprovalsList({ login: currentUser.login, taskID }));
    }, []);

    useEffect(() => {
        setActiveTab((prevState) => prevState.map((item) => {
            if (item.id === TaskCardTabsID.approvals) item.count = inconsistentApprovalsCount;
            return item;
        })
        );
    }, [inconsistentApprovalsCount]);

    useEffect(() => {
        changeActiveTab(openTab??TaskCardTabsID.card);
    }, [openTab])

    function changeActiveTab (id: TabType['id']) : void {
        setActiveTab((prev) => {
            return prev.map(el => {
                el.id == id ?  el.active = true : el.active = false;
                return el;
            });
        })
    }
    useEffect(() => {
        setIsSidebarOpen(isOpen);
    }, [isOpen]);

    const closeCheckinModal = () => {
        setShowCheckinModal(false);
        setReloadList(true);
    }

    const handleComplateTask = () => {
        taskItem.customer?.login === currentUser.login 
            ? setShowComplateTaskModal(true)
            : setShowRequestSuccesModal(true);
    }

    const handleCancelTask = () => {
        taskItem.customer?.login === currentUser.login
            ? setShowDirectorCancelModal(true)
            : setShowRequestCancelModal(true);
    }
    
    return (
        <>
            {/* Модальное окно отмены задачи без согласования */}
            {showDirectorCancelModal && 
                <CancelTaskByDirectorModal closeFunc={() => setShowDirectorCancelModal(false)} taskID={taskID} taskName={taskItem.title} />
            }

            {/* Модальное окно чекина */}
            {showCheckinModal && 
                <CheckINModal closeFunc={() => closeCheckinModal()} id={taskID} parentID={taskItem.idParent ?? null}/>
            }

            {/* Модальное окно отмены запроса на изменение */}
            {showCancelModal && 
                <RequestCancelTaskModal 
                    taskID={taskID} 
                    taskName={taskItem.title}
                    closeFunc={() => setShowRequestCancelModal(false)}
                />
            }

            {/* Модальное окно завершения задачи без согласования */}
            {showComplateTaskModal && 
                <ComplateTaskModal
                    taskID={taskID} 
                    taskName={taskItem.title}
                    closeFunc={() => setShowComplateTaskModal(false)}
                />
            }

            {/* Запрос на выполнение задачи */}
            {showRequestSuccesModal &&
                <RequestSuccesTaskModal 
                    taskID={taskID} 
                    titleTask={taskItem.title} 
                    closeFunc={() => setShowRequestSuccesModal(false)}
                />
            }

            {/* Редактировать дочернюю задачу */}
            {showEditModal && taskItem.idParent && parentTask &&
                (
                    <CreateOKRChildTaskModal 
                    closeFunc={() => setShowEditModal(false)} 
                    parentTask={parentTask}
                    editTask={taskItem}
                    />
                )  
            }

            {/* Редактировать родительскую задачу */}
            {showEditModal && (!taskItem.idParent || !parentTask) && 
                (
                    <CreateOKRTaskModal 
                    closeFunc={() => setShowEditModal(false)} 
                    editTask={taskItem}
                    />
                )  
            }
            
            <Sidebar 
                size={'2/3'}
                className="TaskCard"
                hasOverlay={true}
                isOpen={isSidebarOpen}
                
                onClickOutside={(event: {target: any}) => {
                    if (event.target?.closest('.Sidebar-Overlay')) {
                        setIsSidebarOpen(false);
                        handleOpen(false);
                    }
                }}
                onEsc={() => {
                    setIsSidebarOpen(false);
                    handleOpen(false);
                }}
                >
                <Sidebar.Content className="TaskCard__container">
                    <div className="TaskCard__sidebar">
                        <div className={``}>
                            { tabs.map(el => {
                                if (
                                    (!isDisplayApprovalsTab && el.id === TaskCardTabsID.approvals)
                                    || !isDisplayCheckinTab && el.id === TaskCardTabsID.checkin
                                ) {
                                    return (<></>);
                                }

                                return (
                                    <div 
                                        key={el.id}
                                        className={`TaskCard__tabNav tabNavItem ${el.active ? 'tabNavItem_active' : ""}`} 
                                        onClick={() => changeActiveTab(el.id)}
                                    >
                                        <span className={`me-3`}>{el.icon}</span>
                                        <div className="tabNavItem__title">{el.label}</div>
                                        {Boolean(el.count) && (
                                            <span className={`tabNavItem__counter ${!isCurrentUserSupervisor ? 'tabNavItem__counter_blue' : ''}`}>{el.count}</span>
                                        )}
                                    </div>
                                )
                            })}

                            <div className={'menuHr'}></div>

                                <div className="d-grid row-gap-3 ps-3 pe-3">
                                    {isDisplayCheckinButton &&
                                        <TooltipWhite
                                            position='top'
                                            content={isNewCheckin ? 'Check in на этой недели сделан' : 'Check in на этой недели не сделан'}
                                        >
                                            <Button
                                                className={`TaskCard__menuButton`}
                                                title={isNewCheckin ? 'Обновить Check-in' : 'Сделать Check-in'}
                                                borderRadius='pill'
                                                type='button'
                                                size='lg'
                                                onClick={() => setShowCheckinModal(true)}
                                            >
                                                <svg className='TaskCard__menuButtonIcon me-1' width="17" height="19" viewBox="0 0 17 19" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0542 0.777344H3.43565C1.91789 0.777344 0.6875 2.17024 0.6875 3.88845V7.77734C0.6875 11.1736 2.51472 14.1307 6.07286 16.628C7.40342 17.5618 9.0864 17.5618 10.417 16.628L10.6711 16.4467C14.0631 13.9864 15.8023 11.0898 15.8023 7.77734V3.88845C15.8023 2.17024 14.5719 0.777344 13.0542 0.777344ZM3.43565 2.3329H13.0542C13.813 2.3329 14.4282 3.02935 14.4282 3.88845V7.77734C14.4282 10.4943 12.9605 12.9386 9.93416 15.1338L9.68865 15.3089C8.8059 15.9284 7.68391 15.9284 6.79688 15.3059C3.6079 13.0677 2.06157 10.5652 2.06157 7.77734V3.88845C2.06157 3.02935 2.67677 2.3329 3.43565 2.3329ZM12.1702 4.89203C11.9019 4.5882 11.4669 4.58807 11.1985 4.89173L7.55787 9.01012L5.98547 7.22675L5.92079 7.16199C5.65145 6.92449 5.26173 6.94569 5.01385 7.22583C4.74532 7.52932 4.74496 8.02178 5.01304 8.32578L7.07166 10.6602L7.13636 10.725C7.40581 10.9625 7.79572 10.9412 8.04355 10.6608L12.1699 5.99197L12.2271 5.91872C12.4367 5.61366 12.4178 5.17248 12.1702 4.89203Z" />
                                                </svg>
                                                {isNewCheckin ? 'Обновить Check-in' : 'Сделать Check-in'}
                                            </Button>
                                        </TooltipWhite>
                                    }

                                    {isDisplayComplateTaskButton && (
                                        <Button
                                            className={`TaskCard__menuButton`}
                                            title='Завершить работу'
                                            borderRadius='pill'
                                            type='button'
                                            size='lg'
                                            onClick={handleComplateTask}
                                        >
                                            <svg className='me-1' width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.29525 12.3906C0.886132 10.0057 0.0974009 7.29821 0.000326555 4.52252C-0.00722294 4.30661 0.116675 4.10715 0.315177 4.00636L8.07489 0.066407C8.24924 -0.0221357 8.4578 -0.0221357 8.63215 0.066407L16.3919 4.00636C16.5904 4.10715 16.7143 4.30661 16.7067 4.52252C16.6096 7.29821 15.8209 10.0057 14.4118 12.3906C13.002 14.7766 11.0195 16.7581 8.65198 18.1514C8.46867 18.2593 8.23837 18.2593 8.05506 18.1514C5.68754 16.7581 3.70501 14.7766 2.29525 12.3906Z" fill="#42BD53"/>
                                                <path d="M5.36719 9.69889L7.75627 11.4237L12.5344 6.82422" stroke="white" stroke-width="1.87884" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            Завершить работу
                                        </Button>
                                    )}
                                    {isDisplayEditButton && (
                                        <Button
                                            className={`TaskCard__menuButton`}
                                            title='Редактировать'
                                            borderRadius='pill'
                                            type='button'
                                            size='lg'
                                            onClick={() => {
                                                setShowEditModal(true);
                                            }}
                                        >
                                            <svg className='TaskCard__menuButtonIcon me-1' width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.909 2.15901L5.46967 8.59835C5.32902 8.739 5.25 8.92977 5.25 9.12868V12.1287C5.25 12.5429 5.58579 12.8787 6 12.8787H9C9.19891 12.8787 9.38968 12.7997 9.53033 12.659L15.9697 6.21967C16.8484 5.34099 16.8484 3.91637 15.9697 3.03769L15.091 2.15901C14.2123 1.28033 12.7877 1.28033 11.909 2.15901ZM14.909 4.09835L14.9714 4.169C15.2002 4.46322 15.1794 4.88865 14.909 5.15901L8.688 11.3787H6.75V9.43918L12.9697 3.21967C13.2626 2.92678 13.7374 2.92678 14.0303 3.21967L14.909 4.09835ZM8.27311 3.12891C8.27311 2.71469 7.93732 2.37891 7.52311 2.37891H4.5L4.33733 2.38237C2.34173 2.46754 0.75 4.11234 0.75 6.12891V13.6289L0.753465 13.7916C0.838636 15.7872 2.48343 17.3789 4.5 17.3789H12L12.1627 17.3754C14.1583 17.2903 15.75 15.6455 15.75 13.6289V9.94017L15.745 9.85271C15.7016 9.4797 15.3846 9.19017 15 9.19017C14.5858 9.19017 14.25 9.52596 14.25 9.94017V13.6289L14.2462 13.7611C14.1777 14.9422 13.1983 15.8789 12 15.8789H4.5L4.3678 15.8751C3.18669 15.8067 2.25 14.8272 2.25 13.6289V6.12891L2.25382 5.9967C2.32225 4.8156 3.30174 3.87891 4.5 3.87891H7.52311L7.61058 3.87386C7.98358 3.83054 8.27311 3.51353 8.27311 3.12891Z" />
                                            </svg>
                                            Редактировать
                                        </Button>
                                    )}
                                </div>
                        </div>
                        <div className='TaskCard__footer'>
                            <div className={'menuHr'}></div>
                            {isDisplayCancelTask && (
                                <Button 
                                    onClick={handleCancelTask}
                                    className='TaskCard__cancelBtn'
                                    size='lg'
                                    borderRadius="pill"
                                    title='Отменить задачу'
                                >
                                    <svg className='TaskCard__cancelBtnIcon' width="20" height="23" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.41704 31.983C2.41342 32.4254 2.59885 32.851 2.93267 33.1666C3.26649 33.4821 3.72145 33.6618 4.19775 33.6663H24.803C25.2793 33.6618 25.7343 33.4821 26.0681 33.1666C26.4019 32.851 26.5873 32.4254 26.5837 31.983V9.53906H2.41704V31.983ZM4.83371 11.7835H24.167V31.4219H4.83371V11.7835Z" fill="#FF3F3F"/>
                                        <path d="M10.2702 14.0273H7.85352V28.0548H10.2702V14.0273Z" fill="#FF3F3F"/>
                                        <path d="M15.7087 14.0273H13.292V28.0548H15.7087V14.0273Z" fill="#FF3F3F"/>
                                        <path d="M21.1452 14.0273H18.7285V28.0548H21.1452V14.0273Z" fill="#FF3F3F"/>
                                        <path d="M19.9375 5.04989V1.6833C19.9375 0.739388 19.221 0 18.3063 0H10.6938C9.77904 0 9.0625 0.739388 9.0625 1.6833V5.04989H0V7.29428H29V5.04989H19.9375ZM11.4792 2.24439H17.5208V5.04989H11.4792V2.24439Z" fill="#FF3F3F"/>
                                    </svg>
                                    Отменить задачу
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className='TaskCard__content'>
                        <div className="taskCard__tabHeader taskCard__tabHeader_onlyClose">
                            <Button onlyIcon className='taskCard__tabHeader_btnBack' onClick={() => handleOpen(false)}>
                                <svg className='me-1' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M4.2097 11.3871L4.29289 11.2929L9.29289 6.29289C9.68342 5.90237 10.3166 5.90237 10.7071 6.29289C11.0676 6.65338 11.0953 7.22061 10.7903 7.6129L10.7071 7.70711L7.415 11H19C19.5523 11 20 11.4477 20 12C20 12.5128 19.614 12.9355 19.1166 12.9933L19 13H7.415L10.7071 16.2929C11.0676 16.6534 11.0953 17.2206 10.7903 17.6129L10.7071 17.7071C10.3466 18.0676 9.77939 18.0953 9.3871 17.7903L9.29289 17.7071L4.29289 12.7071C3.93241 12.3466 3.90468 11.7794 4.2097 11.3871Z" fill="#3F8CFF" />
                                </svg>
                                Назад
                            </Button>
                            <CloseModalBtn className="TaskCard__close" closeFunc={() => handleOpen(false)} />
                        </div>

                        <div className="TaskCard__tabTitle TaskCard__tabTitle_withBtn">
                            <div>
                                {taskItem.title}
                                {
                                    taskItem.idParent && (
                                        <div
                                        className="fs-14 fw-normal"
                                        >
                                            Родительская задача: {taskItem.parent.title??""}
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className="TaskCard__scroll customScroll">
                            {tabs.find(el => el.id === 1)?.active && (
                                <TaskCardView 
                                    task={taskItem} 
                                    closeModalFunc={() => handleOpen()} 
                                    taskID={taskID} 
                                    isShow={tabs.find(el => el.id === 1)?.active ?? false}
                                />
                            )}

                            {tabs.find(el => el.id === 2)?.active && (
                                <CheckinCard 
                                    reloadList={reloadList} 
                                    setReloadList={() => setReloadList(false)} 
                                    closeModalFunc={() => handleOpen()} 
                                    task={taskItem}
                                    isShow={tabs.find(el => el.id === 2)?.active ?? false}
                                />
                            )}

                            {tabs.find(el => el.id === 3)?.active && (
                                <ListApprovalsCard
                                    task={taskItem}
                                    closeModalFunc={() => handleOpen()}
                                    isShow={tabs.find(el => el.id === 3)?.active ?? false}
                                />
                            )}
                        </div>     
                    </div>
                </Sidebar.Content>
            </Sidebar>
        </>
    )
}