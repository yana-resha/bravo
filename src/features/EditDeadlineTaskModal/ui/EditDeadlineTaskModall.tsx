import { Modal } from 'react-bootstrap';
import cl from './EditDeadlineTaskModal.module.scss';
import { Button } from '@/shared/ui/Button';
import { TextareaAutosize } from '@mui/material';
import { DatePicker } from '@consta/uikit/DatePicker';
import { IconCalendar } from '@consta/icons/IconCalendar';
import moment from 'moment';
import { ChangeEvent, useEffect, useState } from 'react';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { CreateRequest, ReadResponse, requestAPIService } from '@/entities/request';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';
import { addApproval, updateApproval } from '@/entities/request/model/slices/approvalsSlice';
import { setNewWaitForOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { setNewWaitForChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { findCurrentTask, getParentDueDate, useRootTask } from '@/entities/task/utils/getCurrentTaskByRedux';
import { OKRItem } from '@/widgets/OKRList/ui/OKRItem/OKRItem';

type ModalProps = {
    taskID: string;
    startDate: string | null;
    dueDate: string | null;
    closeFunc: () => void;
    taskName: string;
};

export function EditDeadlineTaskModall({ taskID, closeFunc, dueDate, startDate, taskName }: ModalProps) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const approvalsList = useSelector((state: StoreReducerType) => state.approvalsList.list);
    const waitfor = useSelector((state: StoreReducerType) => state.approvalsList.list
        .filter((approval: ReadResponse) => approval.status === null).length);
    const [newDedlineDate, setNewDedlineDate] = useState<Date | null>(null);
    const [isNewDedlineDateValid, setIsNewDedlineDateValid] = useState(false);
    const [dedlineComment, setDedlineComment] = useState<string>('');
    const [isCommentValid, setIsCommentValid] = useState(false);
    const currentTask = findCurrentTask(taskID);
    const maxDate = currentTask.idParent ? getParentDueDate(taskID) : undefined;
    const [notEdit, setNotEdit] = useState(false);

    useEffect(() => {
        dispatch(setNewWaitForOKRTask({id: taskID, newWaitfor: waitfor}));
        dispatch(setNewWaitForChildTask({id: taskID, newWaitfor: waitfor}));
    }, [waitfor]);

    const humanizedDueDate = dueDate
        ? moment(dueDate, 'DD.MM.YYYY').locale('ru').format('MMM DD, YYYY')
        : 'Не установнен';

    const minDateForDatePicker = startDate ? new Date(moment(startDate, 'DD.MM.YYYY').format('YYYY-MM-DD')) : undefined;

    // если дедлайн родительской задачи уже прошел, то запретить устанавливать дедлайн дочерней задаче
    useEffect(() => {
        if (maxDate) {
            if (moment(maxDate, 'DD.MM.YYYY').isBefore(moment())) {
                setNotEdit(true);
            }
        }
    }, []);

    const getInvalidText = () => {
        if (!isCommentValid && !isNewDedlineDateValid) {
            return 'Пожалуйста, заполните поля комментария и новой даты дедлайна';
        } else if (!isCommentValid && isNewDedlineDateValid) {
            return 'Пожалуйста, заполните поле комментария';
        } else if (isCommentValid && !isNewDedlineDateValid) {
            return 'Пожалуйста, заполните поле новой даты дедлайна';
        }
    };

    const requestDedlineUpdate = async () => {
        const request: CreateRequest = {
            login: currentUser.login,
            idTask: taskID,
            user_comment: dedlineComment,
            qbody: {
                dueDate: moment(newDedlineDate).format('YYYY-MM-DD'),
            },
        };

        await requestAPIService
            .create(request)
            .then((response) => {
                if (response) {
                    showInfoAlert({
                        format: 'mini',
                        type: 'success',
                        text: 'Запрос на изменение данных задачи успешно создан!'
                    });

                    const isFindApproval = Boolean(approvalsList) && approvalsList
                        .findIndex((approval: ReadResponse) => +approval.id === +response.id) !== -1;

                    approvalsList && isFindApproval 
                        ? dispatch(updateApproval(response))
                        : dispatch(addApproval(response));
                }

                closeFunc();
            })
            .catch(() => {
                showInfoAlert({
                    format: 'mini',
                    type: 'error',
                    text: `Не удалось создать запрос на изменение данных задачи`,
                });
            });
    };

    function changeComment(val: string) {
        setIsCommentValid(Boolean(val.replace(/ /g, '').length));
        setDedlineComment(val);
    }

    function changeNewDedlineDate(value: Date | null) {
        setIsNewDedlineDateValid(
            Boolean(value) && !moment(value).isSame(moment(dueDate, 'DD.MM.YYYY')),
        );
        setNewDedlineDate(value);
    }

    const submit = () => {
        if (!newDedlineDate) {
            showInfoAlert({
                format: 'mini',
                type: 'error',
                text: 'Сначала выберите новую дату!',
            });

            return;
        }
        requestDedlineUpdate();
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
                <div className={cl.modalTitle}>Изменение дэдлайна</div>
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
            <div className='position-relative'>
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
                        После применения нового дэдлайна, заявка будет адресована руководителю для ее
                        утверждения
                    </div>
                </div>

                <Modal.Body>
                    <div className={cl.currentValueContainer}>
                        <div className={cl.currentValueLabel}>Действующий дэдлайн:</div>
                        {humanizedDueDate}
                    </div>

                    <div className={cl.actionContainer}>
                        <label className={cl.action}>
                            <div className={`${cl.label}`}>Укажите новый дэдлайн</div>
                            <DatePicker
                                maxDate={typeof maxDate == 'string' ? new Date(moment(maxDate, 'DD.MM.YYYY').format('YYYY-MM-DD')) : maxDate}
                                className={cl.datePicker}
                                dropdownClassName={cl.pickerDropdown}
                                type="date"
                                size="l"
                                placeholder={'Выберите дату'}
                                rightSide={IconCalendar}
                                currentVisibleDate={new Date()}
                                minDate={minDateForDatePicker}
                                value={newDedlineDate}
                                onChange={changeNewDedlineDate}
                            />
                        </label>
                        <label>
                            <div className={cl.label}>Комментарий</div>
                            <TextareaAutosize
                                className={`form-control ${cl.textarea}`}
                                minRows={4}
                                maxRows={20}
                                placeholder=""
                                value={dedlineComment}
                                onChange={(evt: ChangeEvent<HTMLTextAreaElement>) =>
                                    changeComment(evt.target.value)
                                }
                            />
                        </label>
                    </div>
                    
                </Modal.Body>
                {notEdit && (
                    <div className={cl.modalLoader}>
                        <div className={`p-3 pe-4 ps-4 ${cl.alertBlock}`}>
                            Нельзя изменить дэдлайн, так как истек дэдлайн родительской задачи
                        </div>
                    </div>
                )}
            </div>
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
                    {(!isCommentValid || !isNewDedlineDateValid) && (
                        <TooltipWhite content={getInvalidText()}>
                            <Button
                                className={`${cl.footerBtn} ${cl.submitBtn}`}
                                color="primary"
                                onClick={submit}
                                disabled={!isCommentValid || !isNewDedlineDateValid}
                            >
                                Применить
                            </Button>
                        </TooltipWhite>
                    )}

                    {isCommentValid && isNewDedlineDateValid && (
                        <Button
                            className={`${cl.footerBtn} ${cl.submitBtn}`}
                            color="primary"
                            onClick={submit}
                            disabled={!isCommentValid || !isNewDedlineDateValid}
                        >
                            Применить
                        </Button>
                    )}
                </div>
            </div>

            
        </Modal>
    );
}
