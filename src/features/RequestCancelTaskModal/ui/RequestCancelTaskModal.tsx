import { Modal, Spinner } from 'react-bootstrap';
import cl from './RequestCancelTaskModal.module.scss';
import { Button } from '@/shared/ui/Button';
import { TextareaAutosize } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useEffect, useState } from 'react';
import { CreateRequest } from '@/entities/request/types/Request';
import { ReadResponse, requestAPIService } from '@/entities/request';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { addApproval, updateApproval } from '@/entities/request/model/slices/approvalsSlice';
import { setNewWaitForOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { setNewWaitForChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';

type ModalProps = {
    closeFunc: () => void;
    taskID: string;
    taskName: string;
};

export function RequestCancelTaskModal({ closeFunc, taskID, taskName }: ModalProps) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state: StoreReducerType) => state.userData.user);
    const [comment, setComment] = useState<string>('');
    const [isCommentValid, setIsCommentValid] = useState(false);
    const approvalsList = useSelector((state: StoreReducerType) => state.approvalsList.list);
    const waitfor = useSelector((state: StoreReducerType) => state.approvalsList.list
        .filter((approval: ReadResponse) => approval.status === null).length);
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        dispatch(setNewWaitForOKRTask({id: taskID, newWaitfor: waitfor}));
        dispatch(setNewWaitForChildTask({id: taskID, newWaitfor: waitfor}));
    }, [waitfor]);

    const submitHandler = async () => {
        setIsLoad(true);
        const request: CreateRequest = {
            login: currentUser.login,
            idTask: taskID,
            qbody: { status: false },
            user_comment: comment,
        };
        try {
            const createResponse = await requestAPIService.create(request);
            if (createResponse) {
                showInfoAlert({
                    type: 'success',
                    text: `Отправлено на согласование!`,
                    format: 'mini',
                });

                const isFindApproval = Boolean(approvalsList) && approvalsList
                    .findIndex((approval: ReadResponse) => +approval.id === +createResponse.id) !== -1;

                approvalsList && isFindApproval 
                    ? dispatch(updateApproval(createResponse))
                    : dispatch(addApproval(createResponse));

                closeFunc();
            }
        } catch (error: any) {
            console.log(error);
            showInfoAlert({
                type: 'error',
                text: `Не смогли отправить, ошибка сервера`,
                format: 'mini',
            });
        } finally {
            setIsLoad(false);
        }
    };

    function changeComment(val: string) {
        setIsCommentValid(Boolean(val.replace(/ /g, '').length));
        setComment(val);
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
            <div className="d-flex flex-row justify-content-between mb-3">
                <div className={cl.modalTitle}>Подтверждение отмены задачи</div>
                <Button
                    color="light"
                    onClick={closeFunc}
                    className="pt-0 pb-0"
                    size="sm"
                    title="Закрыть модальное окно"
                >
                    <i className="ri-close-fill fs-24"></i>
                </Button>
            </div>

            <Modal.Body>
                <div className={cl.modalTaskName}>{taskName}</div>
                <div className={cl.mainText}>Вы уверены, что хотите отменить задачу?</div>
                <div className={cl.modalDescription}>
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
                    <div>После подтверждения у руководителя, задача будет отменена</div>
                </div>

                <TextareaAutosize
                    className={`form-control ${cl.textarea}`}
                    minRows={4}
                    maxRows={20}
                    placeholder=""
                    value={comment}
                    onInput={(e: any) => changeComment(e.target.value)}
                />
            </Modal.Body>
            <div className={cl.footer}>
                <div></div>
                <div>
                    <Button
                        color="outline-light"
                        onClick={() => closeFunc()}
                        className={`me-4 ${cl.footerBtn}`}
                    >
                        Отмена
                    </Button>
                    {!isCommentValid && (
                        <TooltipWhite content="Пожалуйста, заполните поле комментария">
                            <Button
                                className={`${cl.footerBtn} ${cl.submitBtn}`}
                                color="danger"
                                onClick={() => submitHandler()}
                                disabled={!isCommentValid}
                            >
                                Подтверждаю, отменить
                            </Button>
                        </TooltipWhite>
                    )}

                    {isCommentValid && (
                        <Button
                            className={`${cl.footerBtn} ${cl.submitBtn}`}
                            color="danger"
                            onClick={() => submitHandler()}
                            disabled={!isCommentValid}
                        >
                            Подтверждаю, отменить
                        </Button>
                    )}
                </div>
            </div>

            {isLoad && (
                <div className={cl.modalLoader}>
                    <Spinner animation="border" variant="primary" />
                    <div className="mt-1">Отправляем данные...</div>
                </div>
            )}
        </Modal>
    );
}
