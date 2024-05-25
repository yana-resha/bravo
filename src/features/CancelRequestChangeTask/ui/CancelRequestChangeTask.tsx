import { Modal, Spinner } from 'react-bootstrap';
import cl from './CancelRequestChangeTask.module.scss';
import { Button } from '@/shared/ui/Button';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { ReadResponse, requestAPIService } from '@/entities/request';
import {deleteApproval } from '@/entities/request/model/slices/approvalsSlice';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { setNewWaitForOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { setNewWaitForChildTask } from '@/entities/task/model/slices/childTaskSlice';


type ModalProps = {
    closeFunc: () => void,
    id: string,
    taskID: string,
}

export function CancelRequestChangeTask ({closeFunc, id, taskID} : ModalProps) { 
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const waitfor = useSelector((state: StoreReducerType) => state.approvalsList.list.filter((approval: ReadResponse) => approval.status === null).length);
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
       
        dispatch(setNewWaitForOKRTask({id: taskID, newWaitfor: waitfor}));
        dispatch(setNewWaitForChildTask({id: taskID, newWaitfor: waitfor}));
    }, [waitfor])

    const submitHandler = async () => {
        setIsLoad(true);
        try {
            const response = await requestAPIService.delete({id});
            if (response) {
                if (response === true) {
                    showInfoAlert({
                        type: 'success',
                        text: `Запрос успешно отменён!`,
                        format: 'mini',
                    });

                    dispatch(setNewWaitForOKRTask({id: taskID, newWaitfor: waitfor - 1}));
                    dispatch(setNewWaitForChildTask({id: taskID, newWaitfor: waitfor - 1}));

                    // --------------------------------------------
                    // ВНИМАНИЕ! 
                    // Так как после dispatch перерисовывается список а данное модальное окно находится 
                    // в компоненте элемента согласования - оно будет демонтировано после этой строки.
                    // --------------------------------------------
                    dispatch(deleteApproval({id}));
                    
                } else {
                    showInfoAlert({
                        type: 'error',
                        text: `Не удалось отменить запрос!`,
                        format: 'mini',
                    });
                }
                closeFunc();
            }
        } catch(error: any) {
            console.log(error);
            showInfoAlert({
                type: 'error',
                text: `Не смогли отменить запрос, ошибка сервера`,
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
                <div className={cl.modalTitle}>Отменить запрос на изменение задачи</div>
                <Button color='light' onClick={closeFunc} className='pt-0 pb-0' size='sm' title='Закрыть модальное окно'>
                    <i className="ri-close-fill fs-24"></i>
                </Button>
            </div>

            <Modal.Body style={{marginBottom: '50px'}}>
                <div className={`${cl.mainText}`}>
                    Вы уверены что хотите отменить запрос на изменение задачи?
                </div>

            </Modal.Body>

            <div className={cl.footer}>
                <div></div>
                <div>
                    <Button color="outline-light" 
                        onClick={() => closeFunc()}
                        className={`me-4 ${cl.footerBtn}`}
                    >        
                        Отмена
                    </Button>
                    <Button 
                    onClick={() => submitHandler()}
                    color="danger" 
                    className={`${cl.footerBtn} ${cl.submitBtn}`}>
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
