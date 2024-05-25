import { Modal, Spinner } from 'react-bootstrap';
import cl from './CancelTaskByDirectorModal.module.scss';
import { Button } from '@/shared/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useState } from 'react';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { OKRReduxListTypes,   shiftOKRTaskFromListToList } from '@/entities/task/model/slices/okrListSlice';
import {  updateChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { OKRStatusItem } from '@/entities/task/types/OKREnums';
import taskService from '@/entities/task/services/TaskService';
import { OKRItemUpdateRequest } from '@/entities/task/types/OKRItemRequestType';


type ModalProps = {
    closeFunc: () => void;   
    taskID: string,
    taskName: string;
} 


export function CancelTaskByDirectorModal({closeFunc, taskID, taskName} : ModalProps) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    
    const [isLoad, setIsLoad] = useState(false);

    const submitHandler = async (status: boolean) => {
        setIsLoad(true);
        const request: OKRItemUpdateRequest = {login: currentUser.login, id: taskID, status: OKRStatusItem.cancel}
        try {
            const createResponse = await taskService.updateOKR(request);
            if (createResponse) {
                showInfoAlert({
                    type: 'success',
                    text: `Задача успешно перевелась в статус "Отменена"!`,
                    format: 'mini',
                });
                
                dispatch(shiftOKRTaskFromListToList({id: taskID, from: OKRReduxListTypes.inprogressList, to: OKRReduxListTypes.cancelList}));
                dispatch(updateChildTask({id: taskID, status: OKRStatusItem.cancel}))   
                closeFunc();
            }
        } catch(error: any) {
            console.log(error);
            showInfoAlert({
                type: 'error',
                text: `Не смогли изменить статус задачи, ошибка сервера`,
                format: 'mini',
            });
        } finally {
            setIsLoad(false);
        }
        
    }
    return (
        <Modal
            backdrop="static"
            className=""
            show={true}
            onHide={closeFunc}
            centered
            dialogClassName={cl.taskModalDialog}
            contentClassName={`${cl.taskModal}`}
            scrollable={true}
        >

            <div className='d-flex flex-row justify-content-between mb-3'>
                <div className={cl.modalTitle}>Отменить задачу</div>
                <Button color='light' onClick={closeFunc} className='pt-0 pb-0' size='sm' title='Закрыть модальное окно'>
                    <i className="ri-close-fill fs-24"></i>
                </Button>
            </div>

            <div className={`${cl.correctionContainer}`}>
                <div className={cl.modalTaskName}>{taskName}</div>
                <div className={`${cl.correctionQuestion}`}>Вы уверены, что хотите отменить задачу?</div>
                <div className={`${cl.infoContainer}`}>
                    <div className="me-2">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 11C12.5128 11 12.9355 11.386 12.9933 11.8834L13 12V16C13 16.5523 12.5523 17 12 17C11.4872 17 11.0645 16.614 11.0067 16.1166L11 16V12C11 11.4477 11.4477 11 12 11ZM13.01 8C13.01 7.44772 12.5623 7 12.01 7L11.8834 7.00673C11.386 7.06449 11 7.48716 11 8C11 8.55228 11.4477 9 12 9L12.1266 8.99327C12.624 8.93551 13.01 8.51284 13.01 8Z"
                                fill="#3F8CFF"
                            />
                        </svg>
                    </div>
                    После вашего подтверждение статус задачи станет "Отменена"
                </div>
            </div>

            <div className={cl.footer}>
                <div></div>
                <div>
                    <Button 
                        color="outline-light" 
                        onClick={() => closeFunc()}
                        className={`me-3 ${cl.footerBtn}`}
                    >
                        Закрыть
                    </Button>
                    
                    <Button 
                        onClick={() => submitHandler(false)}
                        color="danger" 
                        className={`me-3 ${cl.footerBtn} ${cl.submitBtn}`}
                    >
                        Да, отменить
                    </Button>
                </div>
            </div>
            {isLoad && (
                <div className={cl.modalLoader}>
                    <Spinner animation="border" variant="primary" />
                    <div className='mt-1'>Отправляем данные...</div>
                </div>
            )}
        </Modal>
    )
}