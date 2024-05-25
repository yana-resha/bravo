/* Hooks */
import { useState, useEffect } from 'react';

/* Redux */
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

/* Services */
import taskService from '@/entities/task/services/TaskService';

/* Components */
import Modal from 'react-bootstrap/Modal';
import { Alert, Spinner } from 'react-bootstrap';
import { Button } from '@/shared/ui/Button';
import { CheckboxGroup } from '@consta/uikit/CheckboxGroup';

/* Types */
import { OKRItemType } from '@/entities/task/types/OKRItemType';

/* Styles */
import './PriorityTaskModal.scss';
import { updateList } from '@/entities/task/model/slices/priorityTaskSlice';

/* Utils */
import { showInfoAlert } from '@/shared/utils/showInfoAlert';


type CheckboxItemType = {
    id: string,
    title: string,
    priority: number,
    disabled: boolean
}

type PriorityTaskModalProps = {
    closeFunc: () => void
}

function PriorityTaskModal ({ closeFunc }: PriorityTaskModalProps) {
    const currentUser = useSelector((state: any) => state?.userData?.user);

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [doneLoadTasks, setDoneLoadTasks] = useState<boolean>(false);
    const [doneFilterTasks, setDoneFilterTasks] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string | null>(null);
    const [listByPriority, setListByPriority] = useState<OKRItemType[] | []>([]);
    const [checkboxItems, setCheckboxItems] = useState<CheckboxItemType[] | [] >([]);
    const [selectedItems, setSelectedItems] = useState<CheckboxItemType[] | []>([]);

    const getListTasks = async () => {
        try {
            const listTasks: OKRItemType[] = await taskService.getListInProgress({login: currentUser.login, taskType: 'OKR' });
            setListByPriority(listTasks);

            const listItems: CheckboxItemType[] = listTasks.map((item: OKRItemType) => {
                return {
                    id: item.id,
                    title: item.title,
                    priority: item.priority,
                    disabled: false
                }
            });
            setCheckboxItems(listItems);
            setDoneLoadTasks(true);
        } catch (error) {
            throw new Error('Произошла ошибка при получении списка задач');
        }
    }

    const savePriorityTask = async () => {
        try {
            const updatedList = listByPriority.filter(task =>  selectedItems.find((item: CheckboxItemType) => item.id === task.id));
            dispatch(updateList(updatedList));
    
            checkboxItems.forEach((item: CheckboxItemType) => {
                taskService.updateOKR({
                    login: currentUser.login, 
                    id:item.id, 
                    priority: isSelected(item) ? 1 : 0
                });
            });
        } catch(error: any) {
            showInfoAlert({
                format: 'mini',
                type: 'error',
                title: 'Произошла ошибка',
                text: error.message,
            });
        } finally {
            closeFunc();
        }
    }

    const isSelected = (item: CheckboxItemType) => {
        return Boolean(selectedItems.find((el: CheckboxItemType) => el.id === item.id));
    }
 
    useEffect(() => {
        setLoading(true);
        try {
            getListTasks();
        } catch(error: any) {
            setErrorList(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (doneLoadTasks && !doneFilterTasks) {
            const filteredItems = checkboxItems.filter(item => item.priority);
            setSelectedItems(filteredItems);
            setDoneFilterTasks(true);
        }
    }, [checkboxItems]);

    useEffect(() => {
        if (selectedItems.length >= 5) {
            const updatedCheckboxItems = checkboxItems.map((item: CheckboxItemType) => {
                if (!isSelected(item)) {
                    item.disabled = true;
                }   
                return item;
            });
            setCheckboxItems(updatedCheckboxItems);
        } else {
            const updatedCheckboxItems = checkboxItems.map((item: CheckboxItemType) => {
                item.disabled = false;   
                return item;
            });
            setCheckboxItems(updatedCheckboxItems);
        }
    }, [selectedItems]);

    return (
        <Modal
            backdrop="static"
            size="lg"
            className=""
            show={true}
            onHide={closeFunc}
            centered
            scrollable={true}
        >
            <Modal.Body>
                <div className='d-flex flex-row justify-content-between align-items-center mb-3'>
                    <div className='PriorityTaskModal__title'>Добавить задачу в приоритетные</div>
                    <Button color='light' onClick={closeFunc} className='pt-0' size='sm' title='Закрыть модальное окно'>
                        <i className="ri-close-fill fs-24"></i>
                    </Button>
                </div>

                {isLoading && (
                    <div className='d-flex flex-column align-items-center justify-content-center p-3'>                                    
                        <Spinner animation="border" variant="primary" />
                        <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                    </div>
                )}

                {errorList && (
                    <Alert 
                        className='d-flex justify-content-center'
                        variant={'danger'}>
                        {errorList}
                    </Alert>
                )}

                <ul className="list-group">
                    <CheckboxGroup
                        getItemKey={(task: CheckboxItemType) => task.id}
                        value={selectedItems}
                        items={checkboxItems}
                        getItemLabel={(task: CheckboxItemType) => task.title}
                        onChange={(value) => (value === null) ? setSelectedItems([]) : setSelectedItems(value)}
                        getItemDisabled={(item) => item.disabled}
                        name={'CheckboxGroup'}
                    />
                </ul> 

                <div className='d-flex justify-content-end'>
                    <Button 
                        className='mt-3 px-3'
                        onClick={() => savePriorityTask()}
                        color='primary'
                    >
                        Сохранить
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default PriorityTaskModal;