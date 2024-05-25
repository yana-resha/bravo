import { Modal, Spinner } from 'react-bootstrap';
import cl from './ComplateTaskModal.module.scss';
import { Button } from '@/shared/ui/Button';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import taskService from '@/entities/task/services/TaskService';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { OKRReduxListTypes, shiftOKRTaskFromListToList, updateOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { updateChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { OKRStatusItem } from '@/entities/task/types/OKREnums';

type ModalProps = {
    closeFunc: () => void;
    taskID: string;
    taskName: string;
};

export function ComplateTaskModal({ closeFunc, taskID, taskName }: ModalProps) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const [isLoad, setIsLoad] = useState(false);

    const submitHandler = async () => {
        setIsLoad(true);
        const request = {
            login: currentUser.login,
            id: taskID,
            status: OKRStatusItem.done,
        }

        await taskService.updateOKR(request)
            .then((response) => {
                showInfoAlert({
                    type: 'success',
                    text: `Задача успешно отмечена завершённой!`,
                    format: 'mini',
                });

                dispatch(updateOKRTask(response));
                dispatch(updateChildTask(response));
                // --------------------------------------------
                // ВНИМАНИЕ! 
                // Так как после dispatch перерисовывается список, модальные окна 
                // карточки и завершения задачи будут демонтированы после этой строки.
                // --------------------------------------------
                dispatch(shiftOKRTaskFromListToList({id: taskID, from: OKRReduxListTypes.inprogressList, to: OKRReduxListTypes.doneList}));
            })
            .catch((error) => {
                showInfoAlert({
                    type: 'error',
                    text: `Не удалось отметить задачу завершённой. Ошибка сети`,
                    format: 'mini',
                });
            })
            .finally(() => {
                console.log('Оно сожрет тебя!');
            });
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
                <div className={cl.modalTitle}>Отменить задачу выполненной</div>
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

            <Modal.Body style={{ marginBottom: '50px' }}>
                <div className={cl.modalTaskName}>{taskName}</div>
                <div className={`${cl.mainText}`}>Вы уверены что хотите отметить задачу выполненной?</div>
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
                    <Button
                        onClick={() => submitHandler()}
                        color="success"
                        className={`${cl.footerBtn} ${cl.submitBtn}`}
                    >
                        Да, задача выполнена
                    </Button>
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
