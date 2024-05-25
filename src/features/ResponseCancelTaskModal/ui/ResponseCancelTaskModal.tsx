import { Modal, Spinner } from 'react-bootstrap';
import cl from './ResponseCancelTaskModal.module.scss';
import { Button } from '@/shared/ui/Button';
import { TextareaAutosize } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useEffect, useState } from 'react';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { ReadResponse, requestAPIService } from '@/entities/request';
import { UpdateRequest } from '@/entities/request/types/Request';
import { updateApproval } from '@/entities/request/model/slices/approvalsSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { OKRReduxListTypes, setNewWaitForOKRTask,  shiftOKRTaskFromListToList } from '@/entities/task/model/slices/okrListSlice';
import { setNewWaitForChildTask, updateChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { OKRStatusItem } from '@/entities/task/types/OKREnums';


type ModalProps = {
    closeFunc: () => void;   
    id: string,
    comment?: string | null,
    taskID: string,
} 


export function ResponseCancelTaskModal({closeFunc, id, taskID, comment = null} : ModalProps) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const waitfor = useSelector((state: StoreReducerType) => state.approvalsList.list
        .filter((approval: ReadResponse) => approval.status === null).length);
    const [myComment, setMyComment] = useState<string>("");
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {

        
        dispatch(setNewWaitForOKRTask({id: taskID, newWaitfor: waitfor}));
        dispatch(setNewWaitForChildTask({id: taskID, newWaitfor: waitfor}));
    }, [waitfor]);

    const submitHandler = async (status: boolean) => {
        setIsLoad(true);
        const request: UpdateRequest = {login: currentUser.login, id: id, status: status, manager_comment: myComment}
        try {
            const createResponse = await requestAPIService.updateStatus(request);
            if (createResponse) {
                showInfoAlert({
                    type: 'success',
                    text: `Ваш ответ успешно отправлен!`,
                    format: 'mini',
                });

                dispatch(updateApproval(createResponse));

                if (status) {
                    dispatch(shiftOKRTaskFromListToList({id: taskID, from: OKRReduxListTypes.inprogressList, to: OKRReduxListTypes.cancelList}));
                    dispatch(updateChildTask({id: taskID, status: OKRStatusItem.cancel}))
                }
                closeFunc();
            }
        } catch(error: any) {
            console.log(error);
            showInfoAlert({
                type: 'error',
                text: `Не смогли отправить ваш ответ, ошибка сервера`,
                format: 'mini',
            });
        } finally {
            setIsLoad(false);
        }
        
    }

    function changeComment(val: string) {
        setMyComment(val);
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
                <div className={cl.modalTitle}>Подтверждение отмены</div>
                <Button color='light' onClick={closeFunc} className='pt-0 pb-0' size='sm' title='Закрыть модальное окно'>
                    <i className="ri-close-fill fs-24"></i>
                </Button>
            </div>

            <div className={`${cl.correctionContainer}`}>
                <div className={`${cl.correctionQuestion}`}>Вы уверены, что хотите отменить задачу?</div>
            </div>

            <Modal.Body className='mb-4'>
                
                <div className={`${cl.infoContainer}`}>
                    <div className={cl.commentContainer}>
                        <div className={`${cl.label} mb-1`}>Комментарий к изменению</div>
                        <div className={cl.comment}>
                            {comment && comment.length > 0 ? comment : 'Комментарий не оставлен'}
                        </div>
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
                            value={myComment}
                            onInput={(e: any) => changeComment(e.target.value)}
                        />
                    </div>
                </div>
            </Modal.Body>

            <div className={cl.footer}>
                <div></div>
                <div>
                    <Button 
                        color="outline-light" 
                        onClick={() => closeFunc()}
                        className={`me-3 ${cl.footerBtn}`}
                    >
                        Отмена, приму решение позднее
                    </Button>
                    
                    <Button 
                        onClick={() => submitHandler(false)}
                        color="danger" 
                        className={`me-3 ${cl.footerBtn} ${cl.submitBtn}`}
                    >
                        Отказать
                    </Button>

                    <Button 
                        onClick={() => submitHandler(true)}
                        color="primary" 
                        className={`${cl.footerBtn} ${cl.submitBtn}`}>
                        Согласовать
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