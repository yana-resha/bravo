import { Modal, Spinner } from 'react-bootstrap';
import cl from './ResponseComplexityTaskModal.module.scss';
import { Button } from '@/shared/ui/Button';
import { TextareaAutosize } from '@mui/material';
import { StarList } from '@/shared/ui/StarList';
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import IResponsible from '@/entities/user/types/IResponsible';
import { getFIOShort } from '@/shared/lib/getFIOShort';
import { useDispatch, useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useEffect, useState } from 'react';
import { ReadResponse, requestAPIService } from '@/entities/request';
import { UpdateRequest } from '@/entities/request/types/Request';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { updateApproval } from '@/entities/request/model/slices/approvalsSlice';
import { setNewWaitForOKRTask, updateOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { setNewWaitForChildTask, updateChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { userRoles } from '@/entities/user/types/userTypes';
import { getUserData } from '@/shared/api/User/UserAPI';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';

type ModalProps = {
    closeFunc: () => void;
    id: string,
    complexity: number,
    newComplexity: number,
    comment?: string | null,
    responsible: IResponsible,
    responsibleComplexity: number,
    responsibleNewComplexity: number,
    taskID: string,
}

export function ResponseComplexityTaskModal(props : ModalProps) {

    const  {
        closeFunc,
        id,
        complexity,
        newComplexity,
        comment = null,
        responsible,
        taskID
    } = props;

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const waitfor = useSelector((state: StoreReducerType) => state.approvalsList.list
        .filter((approval: ReadResponse) => approval.status === null).length);
    const [myComment, setMyComment] = useState<string>("");
    const [isLoad, setIsLoad] = useState(false);

    const [responsibleComplexity, setResponsibleComplexity] = useState(0);
    const [newResponsibleComplexity, setNewResponsibleComplexity] = useState(0);
    const maxUserComplexity = currentUser.role === userRoles.superUser ? 13 : 10;

    useEffect(() => {
        dispatch(setNewWaitForOKRTask({id: taskID, newWaitfor: waitfor}));
        dispatch(setNewWaitForChildTask({id: taskID, newWaitfor: waitfor}));
    }, [waitfor]);

    useEffect(() => {
        if (responsible && responsible.login) fetchResponsibleComplexity(responsible.login);
    });

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

                dispatch(updateApproval(createResponse))

                dispatch(updateOKRTask({id: taskID, complexity: status? newComplexity??null : complexity}));
                dispatch(updateChildTask({id: taskID, complexity: status ?  newComplexity??null : complexity}));
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

    const fetchResponsibleComplexity = async (responsibleLogin: string) => {
        await getUserData({login: responsibleLogin})
            .then((response) => {
                if (response && response.cntComplexity) {
                    setResponsibleComplexity(+response.cntComplexity);
                    setNewResponsibleComplexity(+response.cntComplexity - complexity + newComplexity);
                }
            });
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
                <div className={cl.modalTitle}>Изменение сложности задачи</div>
                <Button color='light' onClick={closeFunc} className='pt-0 pb-0' size='sm' title='Закрыть модальное окно'>
                    <i className="ri-close-fill fs-24"></i>
                </Button>
            </div>
            <Modal.Body className='p-0 mb-5'>
                <div className={`${cl.infoContainer}`}>

                
                    <div className={`${cl.valuesContainer} mb-3`}>
                        <div>
                            <div className={cl.valueLabel}>Действующая сложность:</div>
                            <div className='mb-3'>
                                {complexity > 0 
                                ? <StarList value={complexity} classList='mb-3' status='default'></StarList>
                                : <span className='fs-14'>Сложность не установлена</span>
                                }
                            </div>
                            

                            <div className={`${cl.respItem} d-flex flex-direction-row align-items-center`}>
                                <img src={responsible.avatar ? responsible.avatar : defaultAvatar} alt="" className='rounded-circle avatar-xxs me-2' />
                                <div>
                                    <span className={cl.respName}>{getFIOShort(responsible.fio??'')}</span>
                                    <span className={`rounded-circle ${cl.starValue} ${cl.successValue}`}>
                                        {responsibleComplexity}/{maxUserComplexity}
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div>
                            <div className={cl.valueLabel}>Новая сложность:</div>
                            <div className='mb-3'>
                                {newComplexity > 0 
                                ? <StarList value={newComplexity} classList='mb-3' status='default'></StarList>
                                : <span className='fs-14'>Без сложности</span>
                                }
                            </div>

                            <span className={`rounded-circle ${cl.starValue} ${cl.successValue} ${newResponsibleComplexity > maxUserComplexity ? cl.errorValue : ''}`}>
                                {newResponsibleComplexity}/{maxUserComplexity}
                            </span>
                            
                        </div>
                    </div>

                    <div>
                        <div className={`${cl.label} mb-1`}>Комментарий к изменению</div>
                        <div className={cl.comment}>
                            {comment && comment.length > 0 ? comment : 'Комментарий не установлен'}
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
                <div>
                    
                </div>
                <div>
                    <Button color="outline-light" 
                    onClick={() => closeFunc()}
                    className={`me-3 ${cl.footerBtn}`}>Отмена, приму решение позднее</Button>
                    
                    <Button color="danger" 
                    onClick={() => submitHandler(false)}
                    className={`me-3 ${cl.footerBtn} ${cl.submitBtn}`}
                    >
                        Отказать
                    </Button>

                    {newResponsibleComplexity > maxUserComplexity && (
                        <TooltipWhite 
                            content="Согласование невозможно, так как новая общая сложность сотрудника превышает максимальное значение!"
                        >
                            <Button 
                                onClick={() => submitHandler(true)}
                                color="primary" 
                                className={`${cl.footerBtn} ${cl.submitBtn}`}
                                disabled={newResponsibleComplexity > maxUserComplexity}
                            >   
                                Согласовать
                            </Button>
                        </TooltipWhite>
                    )}

                    {newResponsibleComplexity <= maxUserComplexity && (
                        <Button 
                            onClick={() => submitHandler(true)}
                            color="primary" 
                            className={`${cl.footerBtn} ${cl.submitBtn}`}
                            disabled={newResponsibleComplexity > maxUserComplexity}
                        >   
                            Согласовать
                        </Button>
                    )}
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

function removeApproval(arg0: { login: any; taskID: string; }): any {
    throw new Error('Function not implemented.');
}
