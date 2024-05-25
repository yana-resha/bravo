import { Modal } from 'react-bootstrap';
import cl from './ResponseDeadlineTaskModal.module.scss';
import { Button } from '@/shared/ui/Button';
import { TextareaAutosize } from '@mui/material';
import moment from 'moment';
import { UpdateRequest } from '@/entities/request/types/Request';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { ReadResponse, requestAPIService } from '@/entities/request';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { updateApproval } from '@/entities/request/model/slices/approvalsSlice';
import { setNewWaitForOKRTask, updateOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { setNewWaitForChildTask, updateChildTask } from '@/entities/task/model/slices/childTaskSlice';

type ModalProps = {
    requestID: any;
    userComment: any;
    oldDate: any;
    requestData: string | null;
    closeFunc: () => void;
    taskID: string
}

export function ResponseDeadlineTaskModal({ requestID, userComment, oldDate, requestData, closeFunc, taskID }  : ModalProps) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const waitfor = useSelector((state: StoreReducerType) => state.approvalsList.list
        .filter((approval: ReadResponse) => approval.status === null).length);
    const [dedlineComment, setDedlineComment] = useState<string>('');

    useEffect(() => {
        dispatch(setNewWaitForOKRTask({id: taskID, newWaitfor: waitfor}));
        dispatch(setNewWaitForChildTask({id: taskID, newWaitfor: waitfor}));
    }, [waitfor]);

    const humanizedOldDate = oldDate
      ? moment(oldDate, 'DD.MM.YYYY').locale('ru').format('MMM DD, YYYY')
      : 'Не установнен';

    const humanizedNewDate = requestData
      ? moment(requestData).locale('ru').format('MMM DD, YYYY')
      : 'Не установнен';



    const confirmDedlineUpdate = async (status: boolean) => {
        const request: UpdateRequest = {
            login: currentUser.login,
            id: requestID,
            manager_comment: dedlineComment,
            status: status,
        }

        await requestAPIService.updateStatus(request)
            .then((response) => {
                if (response) {
                    showInfoAlert({
                        format: 'mini',
                        type: 'success',
                        text: 'Статус запроса изменен'
                    });
    
                    dispatch(updateApproval(response))
                    
                    const validDueDate = status? moment(requestData).format('DD.MM.YYYY')??null : moment(oldDate, 'DD.MM.YYYY').format('DD.MM.YYYY');
                    dispatch(updateOKRTask({id: taskID, dueDate: validDueDate}));
                    dispatch(updateChildTask({id: taskID, dueDate: validDueDate}));
                    closeFunc();
                }
            })
            .catch(() => {
                showInfoAlert({
                    format: 'mini',
                    type: 'error',
                    text: `Не удалось изменить статус запроса`
                })
            })
    }

    const submit = (status: boolean) => {
        confirmDedlineUpdate(status);
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
                <div className={cl.modalTitle}>Изменение дэдлайна</div>
                <Button color='light' onClick={closeFunc} className='pt-0 pb-0' size='sm' title='Закрыть модальное окно'>
                    <i className="ri-close-fill fs-24"></i>
                </Button>
            </div>
            
            <Modal.Body className='p-0 mb-5'>
                <div className={`${cl.infoContainer}`}>
                    <div className={`${cl.valuesContainer} mb-2`}>
                        <div>
                            <div className={cl.valueLabel}>Действующий дэдлайн:</div>
                            <div className='mb-3'>
                                {humanizedOldDate}
                            </div>
                        </div>

                        <div>
                            <div className={cl.valueLabel}>Новый дэдлайн:</div>
                            <div className='mb-3'>
                                {humanizedNewDate}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={`${cl.label} mb-1`}>Комментарий к изменению</div>
                        <div className={cl.comment}>{userComment}</div>
                    </div>

                </div>

                <div>
                    <div className={`${cl.label} mb-1`}>Комментарий руководителя</div>
                    <div className='w-100 p-1'>
                        <TextareaAutosize
                            className={`form-control ${cl.textarea}`}
                            minRows={4}
                            maxRows={20}
                            placeholder=''
                            value={dedlineComment}
                            onChange={(evt: ChangeEvent<HTMLTextAreaElement>) => setDedlineComment(evt.target.value)}
                        />
                    </div>
                </div>

            </Modal.Body>

            <div className={cl.footer}>
                <div>
                    
                </div>
                <div>
                    <Button color="outline-light" 
                    onClick={() => closeFunc()}
                    className={`me-3 ${cl.footerBtn}`}>Отмена, приму решение позднее</Button>
                    
                    <Button color="danger" className={`me-3 ${cl.footerBtn} ${cl.submitBtn}`} onClick={() => submit(false)}>Отказать</Button>
                    <Button color="primary" className={`${cl.footerBtn} ${cl.submitBtn}`} onClick={() => submit(true)}>Согласовать</Button>
                </div>
            </div>
        </Modal>
    )
}