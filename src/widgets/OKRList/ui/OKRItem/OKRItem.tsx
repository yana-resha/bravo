/* React & Hooks */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/* Features */
import { CreateTaskModal } from '@/features/CreateTaskModal';
import { DeleteTaskAlert } from '@/features/DeleteTaskAlert';
import { CheckINModal } from '@/features/CheckINModal';

/* Components */
import { StarList } from '@/shared/ui/StarList';
import { Button } from '@/shared/ui/Button';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';

/* Types */
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';

/* Styles */
import cl from './OKRItem.module.scss';
import './OKRItem.scss';

/* Utils */
import { getCheckinStatusColor } from '@/entities/checkIn';
import getProgressColor from '@/entities/task/utils/getProgressColor';
import { AnimatePresence, motion } from 'framer-motion';
import TaskCard from '@/widgets/TaskCard';
import { getDaysFromDate } from '@/shared/utils';


type OKRItemProps = OKRItemType & {
    [key:string]: any,
    children?: React.ReactNode | React.ReactElement,
    closeCollapse?: boolean,
    changeCloseCollapse?: (value: boolean) => void,
    isVisible?: boolean,
    viewTable?:boolean,
}

export function OKRItem (item: OKRItemProps) {
    const {
        closeCollapse = false,
        changeCloseCollapse = () => {},
        title,
        id,
        strategy,
        progress,
        statusCheckin,
        createDate,
        updateDate,
        responsibles,
        dueDate,
        complexity,
        taskType,
        children = [],
        isVisible = true,
        chldrn = null,
        viewTable = false,
    } = item;

    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [taskCollapse, setTaskCollapse] = useState(false);
   
    const cntComplexity = complexity ? Number(complexity) : 0;

    const [isOpenCkList, setIsOpenCkList] = useState<boolean>(id == '37' ? true : false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isCheckINModal, setIsCheckINModal] = useState(false);
    const nameCellPadding = 10;
    const isDisplayCheckinButton = responsibles[0].login === currentUser.login ? true : false;
    const responsibleInitials = responsibles[0]?.fio ? responsibles[0]?.fio?.split(' ').map((el, index) => {
        if (index < 2) return el[0];
    }).join("").toUpperCase(): "";

    const daysFromLastCheckin: any = item.cicreateDate 
        ? getDaysFromDate(item.cicreateDate)
        : '';
    
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

    
    return (
        <>
            {isOpenCkList && (<TaskCard taskID={id} isOpen={isOpenCkList} handleOpen={setIsOpenCkList}/>)}
            {showDeleteAlert && <DeleteTaskAlert taskType='OKR' id={id} setCloseAlert={() => setShowDeleteAlert(false)}/>}
            {showEditModal && <CreateTaskModal taskID={id} type={taskType} closeFunc={closeEditModal}/> }
            {isCheckINModal && <CheckINModal id={id} closeFunc={closeCheckINModal} />}

            <div className={`${cl.itemContainer} ${viewTable ? cl.fillItemContainer : ""} ${isVisible ? "" : "d-none"}`}>
                <AnimatePresence>
                    <motion.header>
                        <div className={`${cl.listRow}`}>
                            {/* Задача */}
                            <div 
                                onClick={() => {
                                    if (!item.chldrn) return;
                                    toggleTaskCollapse();
                                }}
                                className={`${cl.rowCell} ${cl.name}`} 
                                style={{paddingLeft: `${nameCellPadding}px`}}
                            >
                                <div className='me-1' style={{width: '24px', height: '24px'}}>
                                    { item.chldrn && taskCollapse && (
                                        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1H11" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}

                                    { item.chldrn && !taskCollapse && (
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1V11" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M1 6H11" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}

                                    { !item.chldrn && (
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1V11" stroke="#979797" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M1 6H11" stroke="#979797" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                                <TooltipWhite
                                    position='top'
                                    content={title}
                                >
                                    <div className='text-truncate'>
                                        {title}
                                    </div>
                                </TooltipWhite> 
                            </div>

                            {/* Сложность */}
                            <div className={`${cl.rowCell} ${cl.stars}`}>
                                { cntComplexity > 0 && (
                                    <StarList value={cntComplexity} status={getCheckinStatusColor(statusCheckin)} />
                                )}
                            </div>

                            {/* Вес */}
                            <div className={`${cl.rowCell}`}>
                                100%
                            </div>

                            {/* Владелец */}
                            <div className={`${cl.rowCell} ${cl.rowResponsible} ${viewTable ? cl.fillRowResponsible : ""}`}>
                                <TooltipWhite
                                    position='top'
                                    content={responsibles[0].fio}
                                >
                                    <div className={cl.responsible}>{responsibleInitials}</div>
                                </TooltipWhite>  
                            </div>

                            {/* Прогресс */}
                            <div className={`${cl.rowCell} ${cl.progress}`} style={{
                                color: getProgressColor(progress??0),
                            }}>
                                {progress??0} %
                            </div>

                            {/* Checkin */}
                            <div className={cl.rowCell}>
                                { daysFromLastCheckin && (
                                    <div className='me-2'>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 5V11H17" stroke="#EDEBEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#EDEBEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span className='ms-1'>
                                            {daysFromLastCheckin}
                                        </span>
                                    </div>
                                )}

                                { item.cicreateDate && item.ciSeen && (
                                    <TooltipWhite
                                        position='top'
                                        content={'Вы просмотрели последний Check in'}
                                    >
                                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.21536 8.82346L13.7078 0L15 1.34256L5.21536 11.5086L0 6.08992L1.29219 4.74737L5.21536 8.82346Z" fill="#4695F0"/>
                                        </svg>  
                                    </TooltipWhite>                                  
                                )}

                                { item.cicreateDate && !item.ciSeen && (
                                    <TooltipWhite
                                        position='top'
                                        content={'Последний сheck in не просмотрен'}
                                    >
                                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.21536 8.82346L13.7078 0L15 1.34256L5.21536 11.5086L0 6.08992L1.29219 4.74737L5.21536 8.82346Z" fill="#4695F0"/>
                                        </svg>  
                                    </TooltipWhite>                                  
                                )}

                                { !item.cicreateDate && (
                                    <TooltipWhite
                                        position='top'
                                        content={'Check in не создан'}
                                    >
                                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.21536 8.82346L13.7078 0L15 1.34256L5.21536 11.5086L0 6.08992L1.29219 4.74737L5.21536 8.82346Z" fill="#4695F0"/>
                                        </svg>  
                                    </TooltipWhite>                                  
                                )}
                            </div>

                            {/* Управление Chekin */}
                            <div className={`${cl.rowCell} d-flex flex-column align-items-center justify-content-center`}>
                                { isDisplayCheckinButton && 
                                    <TooltipWhite
                                        position='top'
                                        content={statusCheckin ? 'Check in на этой недели сделан' : 'Check in на этой недели не сделан'}
                                    >
                                        <Button color={`${statusCheckin ? 'success' : 'primary'}`} borderRadius='pill' type='button' size='sm' className={``} onClick={() => setIsCheckINModal(true)}>
                                            <svg className='me-1' width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.083 0.583984H2.91634C1.62768 0.583984 0.583008 1.62865 0.583008 2.91732V5.83398C0.583008 8.38116 2.13443 10.599 5.15548 12.4719C6.2852 13.1723 7.71415 13.1723 8.84386 12.4719L9.05965 12.336C11.9396 10.4908 13.4163 8.31836 13.4163 5.83398V2.91732C13.4163 1.62865 12.3717 0.583984 11.083 0.583984ZM2.91634 1.75065H11.083C11.7273 1.75065 12.2497 2.27299 12.2497 2.91732V5.83398C12.2497 7.8717 11.0035 9.70496 8.43394 11.3513L8.22549 11.4826C7.47599 11.9473 6.52336 11.9473 5.77021 11.4804C3.0626 9.80177 1.74967 7.92485 1.74967 5.83398V2.91732C1.74967 2.27299 2.27201 1.75065 2.91634 1.75065ZM10.3324 3.67C10.1047 3.44213 9.73535 3.44203 9.50748 3.66977L6.41634 6.75857L5.08128 5.42104L5.02637 5.37247C4.79768 5.19435 4.46678 5.21024 4.25633 5.42035C4.02833 5.64797 4.02802 6.01731 4.25564 6.24531L6.00352 7.99612L6.05845 8.04471C6.28724 8.22289 6.61829 8.20689 6.82871 7.99658L10.3322 4.49495L10.3808 4.44001C10.5588 4.21122 10.5427 3.88034 10.3324 3.67Z" fill="white"/></svg>
                                            {statusCheckin ? 'Обновить' : 'Сделать'}
                                        </Button>
                                    </TooltipWhite>
                                }
                            </div>

                            {/* Кол-во задач требуемых внимания */}
                            <div className={`${cl.rowCell} ${cl.cellTaskAction}`}>
                                <div className='counterTaskAttention'>3</div>
                            </div>

                            {/* Кнопка "Открыть карточку задачи" */}
                            <div className={'d-flex flex-column align-items-start justify-content-center'}>
                                <Button onlyIcon title='Открыть список Сheck in-ов' onClick={() => setIsOpenCkList(true)}>
                                    <svg className='mb-1 mt-1' width="19" height="19" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 0V8.5H17.7333V2.07627L5.91027 12.6548L5.01473 11.8535L16.9961 1.13333H9.5V0H19ZM13.9333 15.8667H1.26667V4.53333H9.59373V3.4H0V17H15.2V8.25747H13.9333V15.8667Z" fill="black" />
                                    </svg>
                                </Button>
                            </div>
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
