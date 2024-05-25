import { Modal, Spinner } from 'react-bootstrap';
import cl from './EditComplexityTaskModal.module.scss';
import { Button } from '@/shared/ui/Button';
import { StarList } from '@/shared/ui/StarList';
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import Rating from '@mui/material/Rating';
import { TextareaAutosize } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { getFIOShort } from '@/shared/lib/getFIOShort';
import { ReadResponse, requestAPIService } from '@/entities/request';
import { CreateRequest } from '@/entities/request/types/Request';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { addApproval, updateApproval } from '@/entities/request/model/slices/approvalsSlice';
import { setNewWaitForOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { setNewWaitForChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { userRoles } from '@/entities/user/types/userTypes';
import { getUserData } from '@/shared/api/User/UserAPI';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';

type ModalProps = {
    closeFunc: () => void;
    taskID: string;
    currentValue: number;
    taskName: string;
};

export function EditComplexityTaskModal({ closeFunc, taskID, currentValue, taskName }: ModalProps) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state: StoreReducerType) => state.userData.user);
    const [comment, setComment] = useState<string>('');
    const [isCommentValid, setIsCommentValid] = useState(false);
    const approvalsList = useSelector((state: StoreReducerType) => state.approvalsList.list);
    const waitfor = useSelector((state: StoreReducerType) => state.approvalsList.list
        .filter((approval: ReadResponse) => approval.status === null).length);
    const [isLoad, setIsLoad] = useState(false);

    const [complexityValue, setComplexityValue] = useState(currentValue);
    const [isComplexityValid, setIsComplexityValid] = useState(false);
    const [currentUserComplexity, setCurrentUserComplexity] = useState(0);
    const [userSumComplexity, setUserSumComplexity] = useState(0);
    const maxUserComplexity = currentUser.role === userRoles.superUser ? 13 : 10;

    useEffect(() => {
        fetchCurrentUserData();
    }, []);

    useEffect(() => {
        dispatch(setNewWaitForOKRTask({id: taskID, newWaitfor: waitfor}));
        dispatch(setNewWaitForChildTask({id: taskID, newWaitfor: waitfor}));
    }, [waitfor]);

    const getInvalidText = () => {
        if (!isCommentValid && !isComplexityValid) {
            return 'Пожалуйста, заполните поле комментария и измените сложность на новую';
        } else if (!isCommentValid && isComplexityValid) {
            return 'Пожалуйста, заполните поле комментария';
        } else if (isCommentValid && !isComplexityValid) {
            return 'Пожалуйста, измените сложность на новую';
        }
    };

    const fetchCurrentUserData = async () => await getUserData({login: currentUser.login})
            .then((response) => {
                if (response) {
                    setCurrentUserComplexity(Number(response.cntComplexity ?? 0));
                    setUserSumComplexity(Number(response.cntComplexity ?? 0));
                } else {
                    throw new Error('Не удалось загрузить ваши данные');
                }
            });

    function changeComplexityValue(value: number) {
        setIsComplexityValid(value !== currentValue);
        setUserSumComplexity(currentUserComplexity - currentValue + value);
        setComplexityValue(value);
    }

    function changeComment(val: string) {
        setIsCommentValid(Boolean(val.replace(/ /g, '').length));
        setComment(val);
    }

    const submitHandler = async () => {
        setIsLoad(true);
        const request: CreateRequest = {login: currentUser.login, idTask: taskID, qbody: {complexity: complexityValue}, user_comment: comment}
        try {
            const createResponse = await requestAPIService.create(request);
            if (createResponse) {
                const isFindApproval = Boolean(approvalsList) && approvalsList
                    .findIndex((approval: ReadResponse) => +approval.id === +createResponse.id) !== -1;

                showInfoAlert({
                    type: 'success',
                    text: `Запрос на изменение сложности успешно отправлен!`,
                    format: 'mini',
                });

                approvalsList && isFindApproval 
                    ? dispatch(updateApproval(createResponse))
                    : dispatch(addApproval(createResponse));

                closeFunc();
            }
        } catch (error: any) {
            console.log(error);
            showInfoAlert({
                type: 'error',
                text: `Не смогли отправить изменения, ошибка сервера`,
                format: 'mini',
            });
        } finally {
            setIsLoad(false);
        }
    };

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
                <div className={cl.modalTitle}>Изменение сложности задачи</div>
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

            <div className={cl.modalTaskName}>{taskName}</div>

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
                <div>
                    После применение нового уровня сложности, заявка будет адресована руководителю
                    для ее утверждения
                </div>
            </div>

            <Modal.Body>
                <div className={cl.currentValueContainer}>
                    <div className={cl.currentValueLabel}>Действующая сложность:</div>
                    {currentValue > 0 ? (
                        <StarList value={currentValue} status="default"></StarList>
                    ) : (
                        <span className="fs-14">Не установлена</span>
                    )}
                </div>

                <div className={cl.actionContainer}>
                    <div className={cl.actionTitle}>Выберите новый уровень сложности</div>
                    <div className={`${cl.ratingContainer}`}>
                        <div className="d-flex flex-row align-items-center">
                            <div className={`${cl.label} me-5`}>
                                Сложность задачи{' '}
                                <span className="fw-normal">(min 1, max 3, шаг 0.5)</span>
                            </div>

                            <div
                                className={`${cl.respItem} d-flex flex-direction-row align-items-center`}
                            >
                                <img
                                    src={currentUser.avatar ? currentUser.avatar : defaultAvatar}
                                    alt=""
                                    className="rounded-circle avatar-xs me-2"
                                />
                                <div>
                                    <span className={cl.respName}>
                                        {getFIOShort(currentUser.fio)}
                                    </span>
                                    <span
                                        className={`rounded-circle ${cl.starValue} ${
                                            cl.successValue
                                        } ${
                                            userSumComplexity > maxUserComplexity
                                                ? cl.errorValue
                                                : ''
                                        }`}
                                    >
                                        {userSumComplexity}/{maxUserComplexity}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Rating
                            className={'ratingStars'}
                            name="simple-controlled"
                            defaultValue={currentValue}
                            value={complexityValue}
                            precision={0.5}
                            size="large"
                            max={3}
                            disabled={false}
                            onChange={(event, newValue) => {
                                changeComplexityValue(newValue ?? 0);
                            }}
                        />
                    </div>
                    <div className={`${cl.commentContainer}`}>
                        <div className={`${cl.label} mb-3`}>Комментарий</div>

                        <div className="w-100">
                            <TextareaAutosize
                                className={`form-control ${cl.textarea}`}
                                minRows={4}
                                maxRows={20}
                                placeholder=""
                                value={comment}
                                onInput={(e: any) => changeComment(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
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

                    {(!isCommentValid || !isComplexityValid) && (
                        <TooltipWhite content={getInvalidText()}>
                            <Button
                                onClick={() => submitHandler()}
                                disabled={!isCommentValid || !isComplexityValid}
                                color="primary"
                                className={`${cl.footerBtn} ${cl.submitBtn}`}
                            >
                                Применить
                            </Button>
                        </TooltipWhite>
                    )}

                    {isCommentValid && isComplexityValid && (
                        <Button
                            onClick={() => submitHandler()}
                            disabled={!isCommentValid || !isComplexityValid}
                            color="primary"
                            className={`${cl.footerBtn} ${cl.submitBtn}`}
                        >
                            Применить
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
