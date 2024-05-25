import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { ConfirmComplationTaskModal } from '@/features/ConfirmComplationTaskModal';
import { useEffect, useState } from 'react';
import { ResponseDeadlineTaskModal } from '@/features/ResponseDeadlineTaskModal';
import { ResponseComplexityTaskModal } from '@/features/ResponseComplexityTaskModal';
import { ResponseCancelTaskModal } from '@/features/ResponseCancelTaskModal';
import { requestTypes, requestTypesLabels, requestStatusLabels } from '../../../types/requestTypes';
import { OKRStatusItem } from '@/entities/task/types/OKREnums';
import { StarList } from '@/shared/ui/StarList';
import { Button } from '@/shared/ui/Button';
import { CancelRequestChangeTask } from '@/features/CancelRequestChangeTask';


export const ApprovalItem = (props: any) => {
    const {
        id,
        taskData,
        mAvatar,
        mFIO,
        manager_comment,
        manager_update,
        managerLogin,
        qbody,
        status,
        uAvatar,
        uFIO,
        user_comment,
        user_update
    } = props;

    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const isManager = currentUser.login === managerLogin;

    const authorName = uFIO;
    const authorAvatar = uAvatar;
    const requsetDateFormat = user_update && user_update !== '' 
                                ? moment(user_update, 'YYYY-MM-DD HH:mm:ss').format('DD.MM.YYYY HH:mm') 
                                : '';
    const responseDateFormat = manager_update && manager_update !== '' 
                                ? moment(manager_update, 'YYYY-MM-DD HH:mm:ss').format('DD.MM.YYYY HH:mm') 
                                : '';
    const requestData = JSON.parse(qbody);

    const getRequestData = (): [requestTypes | null, requestTypesLabels | null] => {
        if (requestData.status === true) {
            return [requestTypes.statusSuccess, requestTypesLabels.statusSuccess];
        }
        if (requestData.status === false) {
            return [requestTypes.statusCancel, requestTypesLabels.statusCancel];
        }
        if (requestData.complexity !== null && requestData.complexity !== undefined) {
            return [requestTypes.complexity, requestTypesLabels.complexity];
        }
        if (requestData.dueDate !== null && requestData.dueDate !== undefined) {
            return [requestTypes.deadline, requestTypesLabels.deadline];
        }
        return [null, null];
    }

    const [requestType, essenceLabel] = getRequestData();
    
    const [showResponseSuccesModal, setShowResponseSuccesModal] = useState(false);
    const [showResponseCancelModal, setShowResponseCancelModal] = useState(false);
    const [showResponseComplexityModal, setShowResponseComplexityModal] = useState(false);
    const [showResponseDeadlineModal, setShowResponseDeadlineModal] = useState(false);
    const [showCancelRequestChangeTask, setShowCancelRequestChangeTask] = useState(false);
    useEffect(() => {
        if (requestData.dueDate) {
            console.log(taskData.dueDate, requestData.dueDate)
        }
        
    }, [])

    const approveHandler = () => {
        switch (requestType) {
            case requestTypes.statusSuccess:
                setShowResponseSuccesModal(true);
                break;
            case requestTypes.statusCancel:
                setShowResponseCancelModal(true);
                break;
            case requestTypes.complexity:
                setShowResponseComplexityModal(true);
                break;
            case requestTypes.deadline:
                setShowResponseDeadlineModal(true);
                break;
        }
    }

    return (
        <>

            {/* Согласование выполнения задачи */}
            {showCancelRequestChangeTask && 
                <CancelRequestChangeTask 
                    taskID={taskData.id}
                    id={id} 
                    closeFunc={() => setShowCancelRequestChangeTask(false)}
                />
            }
            {/* Согласование выполнения задачи */}
            {showResponseSuccesModal && 
                <ConfirmComplationTaskModal 
                    id={id} 
                    closeFunc={() => setShowResponseSuccesModal(false)}
                    taskID={taskData.id}
                />
            }
            {/* Согласование отмены задачи */}
            {showResponseCancelModal &&
                <ResponseCancelTaskModal
                    id={id}
                    comment={user_comment} 
                    taskID={taskData.id}
                    closeFunc={() => setShowResponseCancelModal(false)}
                />
            }
            {/* Согласование изменения сложности */}
            {showResponseComplexityModal &&
                <ResponseComplexityTaskModal 
                    id={id}
                    taskID={taskData.id}
                    complexity={taskData.complexity ?? 0}
                    newComplexity={requestData.complexity}
                    responsible={taskData.responsibles[0]}
                    comment={user_comment}
                    responsibleComplexity={5}
                    responsibleNewComplexity={8}
                    closeFunc={() => setShowResponseComplexityModal(false)}
                />
            }
            {/* Согласование изменения дедлайна */}
            {showResponseDeadlineModal && 
                <ResponseDeadlineTaskModal 
                    requestID={id} 
                    taskID={taskData.id}
                    userComment={user_comment}
                    oldDate={taskData.dueDate}
                    requestData={requestData.dueDate}
                    closeFunc={() => setShowResponseDeadlineModal(false)}
                />
            }

            <div className="ServiceMessage">
                <div className='ServiceMessages__header'>
                    <div className="ServiceMessages__author">
                        <img className="ServiceMessages__authorAvatar" src={authorAvatar || defaultAvatar} alt="" />
                        <span className="ServiceMessages__authorName">{authorName}</span>
                    </div> 
                    <div className="ServiceMessages__date">{requsetDateFormat}</div>
                </div>

                <div className='ServiceMessages__detail'>
                    <div className="ServiceMessages__label">Суть запроса:</div>
                    <div className="ServiceMessages__content">
                        {essenceLabel}

                        {!isManager && status !== requestStatusLabels.success && status !== requestStatusLabels.fail && (
                            <Button 
                                className='ms-4'
                                onClick={() => setShowCancelRequestChangeTask(true)}
                                size='sm'
                                borderRadius='pill'
                                color='danger'
                                title='Отменить запрос на изменение'
                            >   
                                <svg className='me-1' width="15" height="15" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.5 18C14.1944 18 18 14.1944 18 9.5C18 4.80558 14.1944 1 9.5 1C4.80558 1 1 4.80558 1 9.5C1 14.1944 4.80558 18 9.5 18Z" stroke="white" strokeMiterlimit="10"/>
                                <path d="M6.3125 6.3125L12.6875 12.6875" stroke="white" strokeMiterlimit="10"/>
                                <path d="M12.6875 6.3125L6.3125 12.6875" stroke="white" strokeMiterlimit="10"/>
                                </svg>
                               отменить запрос 
                            </Button>
                        )}


                    </div>
                    
                </div>

                {
                    requestData.complexity !== null && requestData.complexity !== undefined && (
                        <div className='ServiceMessages__detail'>
                            <div className='d-flex flex-row align-items-start'>
                                <div className='me-5'>
                                    <div className="ServiceMessages__label">Текущее значение:</div>
                                    <div className="ServiceMessages__content">
                                        {
                                            Boolean(taskData.complexity) && taskData.complexity > 0
                                            ? <StarList value={taskData.complexity} status='default'/>
                                            : 'Не установлено'
                                        }
                                    </div>
                                </div>
                        
                                <div>
                                    <div className="ServiceMessages__label">Новое значение:</div>
                                    <div className="ServiceMessages__content">
                                        {
                                            Boolean(requestData.complexity) && requestData.complexity > 0
                                            ? <StarList value={requestData.complexity} status='default'/>
                                            : 'Не установлено'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    requestData.dueDate && (
                        <div className='ServiceMessages__detail'>
                            <div className='d-flex flex-row align-items-start'>
                                <div className='me-5'>
                                    <div className="ServiceMessages__label">Текущее значение:</div>
                                    <div className="ServiceMessages__content">{taskData.dueDate ? moment(taskData.dueDate, 'DD.MM.YYYY').locale('ru').format('MMM DD, YYYY') : 'Не установлено'}</div>
                                </div>

                                <div>
                                    <div className="ServiceMessages__label">Новое значение:</div>
                                    <div className="ServiceMessages__content">{requestData.dueDate ? moment(requestData.dueDate).locale('ru').format('MMM DD, YYYY') : 'Не установлено'}</div>
                                </div>
                            </div>
                        </div>
                    )
                }

                { Boolean(user_comment) && (
                    <div className='ServiceMessages__detail'>
                        <div className="ServiceMessages__label">Комменатрий к запросу:</div>
                        <div className="ServiceMessages__content">{user_comment}</div>
                    </div>
                )}

                <div className='ServiceMessages__detail'>
                    <div className="ServiceMessages__label">
                        <span>Решение руководителя:</span>
                        {responseDateFormat && (
                            <span className='ServiceMessages__date'>{responseDateFormat}</span>
                        )}    
                    </div>
                    <div className="ServiceMessages__content">
                        { status === requestStatusLabels.success && (
                            <div className="ServiceMessages__SolutionLabel ServiceMessages__SolutionLabel_success">Одобрено</div>
                        )}

                        { status === requestStatusLabels.fail && (
                            <div className="ServiceMessages__SolutionLabel ServiceMessages__SolutionLabel_fail">Отказано</div>
                        )}

                        {
                            status === null && (taskData.status == OKRStatusItem.done || taskData.status == OKRStatusItem.cancel) && (
                                <div className="ServiceMessages__SolutionLabel ServiceMessages__SolutionLabel_default">Заявка приостановлена в связи с переводом задачи в статуc "{taskData.status}"</div>
                            )
                        }

                        { status === null && taskData.status !== OKRStatusItem.done && taskData.status !== OKRStatusItem.cancel && (
                            Boolean(isManager) 
                                ? <div 
                                    className="ServiceMessages__SolutionLabel"
                                    onClick={approveHandler}
                                    role='button'
                                  >
                                    Перейти к согласованию
                                  </div>
                                : <div className="ServiceMessages__SolutionLabel">Ожидает решение руководителя</div>
                        )}
                    </div>
                </div>

                {manager_comment && (
                    <div className='ServiceMessages__detail'>
                        <div className="ServiceMessages__label">Комменатрий:</div>
                        <div className="ServiceMessages__content">{manager_comment}</div>
                    </div>
                )}
            </div>
        </>
    );
}