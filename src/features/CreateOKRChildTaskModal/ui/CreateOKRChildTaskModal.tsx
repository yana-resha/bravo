import {Modal, Spinner} from 'react-bootstrap';
import cl from './CreateOKRChildTaskModal.module.scss';
import './CreateOKRChildTaskModal.scss';
import { Button } from '@/shared/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useTaskName } from '../libs/hooks/useTaskName';
import { Field } from '@/shared/ui/Field';
import { useEffect, useState } from 'react';
import { Input } from '@/shared/ui/Input';
import IResponsible from '@/entities/user/types/IResponsible';
import { ResponsibleSelect } from './ResponsibleSelect/ResponsibleSelect';
import { CustomerSelect } from './CustomerSelect/CustomerSelect';
import { Rating, TextareaAutosize } from '@mui/material';
import { DatePicker, DatePickerPropValue } from '@consta/uikit/DatePicker';
import { Combobox } from '@consta/uikit/Combobox';
import { useHashtags } from '../libs/hooks/useHashtags';
import { OKRItemCreateRequest } from '@/entities/task/types/OKRItemRequestType';
import moment from 'moment';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { addChldrnOKRTask} from '@/entities/task/model/slices/okrListSlice';
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { createKR, updateKRItem } from '@/entities/task/api/krAPI';
import { addChildTask, addChldrnChildTask, updateChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { KRItemUpdateRequest } from '@/entities/task/types/KRRequestType';
import { useWeight } from '../libs/hooks/useWeigth';
import ReactQuill from 'react-quill';
import { getParentDueDate } from '@/entities/task/utils/getCurrentTaskByRedux';

type CreateOKRTaskModalProps = {
    closeFunc: () => void;
    parentTask: OKRItemType,
    editTask?: OKRItemType,
}

export function CreateOKRChildTaskModal({closeFunc, parentTask, editTask = undefined} : CreateOKRTaskModalProps) {

    const dispatch = useDispatch();
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    // запустить проверку на валидность каждого поля (отобразить для пользователя что поля заполнены не верно)
    const [verityValid, setVerityValid] = useState<boolean>(false);
    // значения
    const {nameValue, handlerChangeName, nameInvalid} = useTaskName('');
    const [responsible, setResponsible] = useState<IResponsible | null>(null);
    const [customer, setCustomer] = useState<IResponsible | null>(null);
    const [successTextArea, setSuccessTextArea] = useState('');
    const [startDate, setStartDate] = useState<undefined | DatePickerPropValue<"date"> | Date>(undefined);
    const [dueDate, setDueDate] = useState<undefined | DatePickerPropValue<"date"> | Date>(undefined);
    const [complexity, setComplexity] = useState<number>(0);
    const {hashtagValue, setHashtagValue, hashtagList, handleCreateHashtag} = useHashtags();
    const {weightValue, changeWeightValue} = useWeight();
    // 
    const [formInLoad, setFormInLoad] = useState<boolean>(false);

    // максимальный дедлайн который можно установить
    const maxDate = getParentDueDate(parentTask.id);

    const handlerStartDate = (date: undefined | DatePickerPropValue<"date"> | Date) => {
        setStartDate(date);
        if (dueDate && moment(dueDate).isSameOrBefore(date)) {
            setDueDate(date);
        }
    }
    
    const handlerDueDate = (date: undefined | DatePickerPropValue<"date"> | Date) => {
        setDueDate(date);
    }
    const changeComplexity = (value: number | null) => {
        setComplexity(value??0)
    }

    

    // сбрасываю сложность если владельцем задачи юзер установил самого себя
    useEffect(() => {
        if (responsible?.login == currentUser.login) {
            changeComplexity(0);
        }
    }, [responsible]);

    const setRequestForm = () => {
        let request: any = {
            login: currentUser.login,
            title: nameValue
        }

        if (editTask) request.id = editTask.id;
        if (nameInvalid) return false;
        if (!responsible) return false;
        request.tags = hashtagValue && hashtagValue.map((item) => item.label);
        request.startDate = startDate ? moment(startDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        request.dueDate = dueDate ? moment(dueDate).format('YYYY-MM-DD') : undefined;
        request.complexity = complexity;
        request.responsibles = responsible ? [responsible] : [];
        request.description = successTextArea ?? '';
        request.customer = customer?.login??currentUser.login;
        request.idParent = parentTask.id;
        request.weight = weightValue;
        return request;
    }
    const createNewTask = async (request : OKRItemCreateRequest) => {
        setFormInLoad(true);
        try {

            let response = await createKR(request);
            if (response) {
                dispatch(addChildTask(response));
                
                if (parentTask.idParent) {
                    dispatch(addChldrnOKRTask(parentTask.id));
                } else {
                    dispatch(addChldrnChildTask(parentTask.id));
                }
                
                showInfoAlert({
                    format : 'mini', 
                    text: `Задача "${response.title}" успешно добавлена!`, 
                    type: 'success',
                });
                closeFunc();
            }
            

        } catch (error: any) {

            showInfoAlert({
                format : 'full', 
                text: error.message, 
                type: 'error',
            });

        } finally {
            setFormInLoad(false);
        }
    }
    const updateTask = async (request : KRItemUpdateRequest) => {
        setFormInLoad(true);
        try {

            let response = await updateKRItem(request);
            if (response) {
                dispatch(updateChildTask(response));
                showInfoAlert({
                    format : 'mini', 
                    text: `Задача "${response.title}" успешно изменена!`, 
                    type: 'success',
                });
                closeFunc();
            }
            

        } catch (error: any) {

            showInfoAlert({
                format : 'full', 
                text: error.message, 
                type: 'error',
            });

        } finally {
            setFormInLoad(false);
        }
    }
    const handlerSubmit = () => {
        setVerityValid(true);
        const request = setRequestForm();
        if (request) {
            if (editTask) {
                updateTask(request);
            } else {
                createNewTask(request); 
            }
           
            
        } else {
            showInfoAlert({
                format : 'full', 
                text: 'Пожалуйста, заполните все обязательные поля', 
                type: 'error'
            });  
        }
    };

    useEffect(() => {
        if (editTask) {
            handlerChangeName(editTask.title);
            setSuccessTextArea(editTask.description??"");
            setComplexity(editTask.complexity??0);
            changeWeightValue(editTask.weight??0);
            if (editTask.tags) {
                editTask.tags.forEach(tag => handleCreateHashtag(tag));
            }
            
            if (editTask.dueDate) {
                handlerDueDate(new Date(moment(editTask.dueDate, 'DD.MM.YYYY').format('YYYY-MM-DD')));
            } 

            if (editTask.startDate) {
                handlerStartDate(new Date(moment(editTask.startDate, 'DD.MM.YYYY').format('YYYY-MM-DD')));
            }
        }
    }, []);
    
    return (
    <>
        <Modal
        // backdrop="static"
        backdrop={false}
        className="taskModal"
        show={true}
        onHide={closeFunc}
        centered
        dialogClassName={cl.taskModalDialog}
        contentClassName={`${cl.taskModal}`}
        scrollable={true}
        >

            <div className='d-flex flex-row justify-content-between align-items-start mb-1'>
                <div className={cl.modalTitle}>
                    {
                        editTask 
                        ? `Редактировать задачу "${editTask.title}"`
                        : `Добавить под задачу к задаче "${parentTask.title}"`
                    }
                </div>
                <Button color='light' onClick={closeFunc} size='sm' title='Закрыть модальное окно'>
                    <i className="ri-close-fill fs-24"></i>
                </Button>
            </div>

            <Modal.Body>
                <div>
                    {/* Наименование задачи */}
                    <Field
                        label={<>Наименование задачи<span className={cl.labelStar}>*</span></>}
                        className={`mb-3 ${cl.w4}`}
                        error={nameInvalid && verityValid ? nameInvalid : false}
                    >
                        <Input
                        placeholder="Введите наименование задачи, не более 64 символов"
                        value={nameValue}
                        handlerInput={handlerChangeName}
                        inValid={nameInvalid && verityValid ? true : false}
                        maxLength={64}
                        />
                    </Field>
                    <div className={`${cl.grid2Column} mb-3`}>
                        <Field
                            label={<>Владелец<span className={cl.labelStar}>*</span></>}
                            error={!responsible && verityValid ? 'владелец обязательное поле для заполнения' : false}
                        >
                            <ResponsibleSelect 
                            invalid={!responsible && verityValid}
                            responsible={responsible} 
                            defaultValue={editTask?.responsibles[0]??undefined}
                            setResponsible={(val : IResponsible | null) => setResponsible(val)} />
                            
                        </Field>

                        <Field
                        label={<>Заказчик</>}
                        // error={nameInvalid && verityValid ? nameInvalid : false}
                        >
                            <CustomerSelect
                            defaultValue={editTask?.customer ? editTask?.customer : undefined} 
                            responsible={responsible}
                            customer={customer} 
                            setCustomer={(obj) => setCustomer(obj)} />
 
                            
                        </Field>
                    </div>

                    <Field
                        className='mb-3'
                        label={<>Описание, критерии успеха и приоритеты</>}
                        // error={!responsible && verityValid ? true : false}
                    >
                        <div className='w-100'>
                            <ReactQuill theme="snow" value={successTextArea} 
                            onChange={(value) => setSuccessTextArea(value)} 
                            className={`${cl.editor}`}
                            />
                        </div>
                    </Field>

                    <div className={`${cl.grid3Column} mb-3`}>

                        <Field
                            label={<>Начало работы</>}
                        >
                            <div>
                                <DatePicker
                                    className='date-picker'
                                    dropdownClassName={cl.pickerDropdown}
                                    type="date"
                                    value={startDate}
                                    onChange={handlerStartDate}
                                    placeholder={'Выберите дату'}
                                    minDate={new Date()}
                                />
                            </div>
                        </Field>

                        <Field
                            label={<>Окончание работы (дэдлайн)</>}
                        >
                            <div>
                                <DatePicker
                                    maxDate={typeof maxDate == 'string' ? new Date(moment(maxDate, 'DD.MM.YYYY').format('YYYY-MM-DD')) : maxDate}
                                    className='date-picker'
                                    dropdownClassName={cl.pickerDropdown}
                                    type="date"
                                    value={dueDate}
                                    onChange={handlerDueDate}
                                    placeholder={'Выберите дату'}
                                    minDate={new Date()}
                                />
                            </div>
                        </Field>
                        {
                            responsible?.login !== currentUser.login && (
                                <Field
                                    label={
                                        <>Сложность задачи <span className={cl.labelLight}>(min 1, max 3, шаг 0.5)</span></>
                                    }
                                >
                                    <div>
                                    <Rating
                                        className={'ratingStars'}
                                        name="simple-controlled"
                                        defaultValue={1}
                                        value={complexity}
                                        precision={0.5}
                                        size="large"
                                        max={3}
                                        // disabled={starDisabled}
                                        onChange={(event, newValue) => {
                                            changeComplexity(newValue);
                                        }}
                                    />
                                    </div>
                                </Field>
                            )
                        }
                        
                    </div>
                    <div className={`${cl.grid2Column} mb-3`}>
                        <Field
                        label={
                            <>Хэштеги</>
                        }
                        >
                            <Combobox
                                className='hashtagSelect'
                                dropdownClassName='selectDropdown'
                                placeholder="Выберите хэштеги"
                                multiple
                                items={hashtagList}
                                value={hashtagValue}
                                onChange={setHashtagValue}
                                onCreate={handleCreateHashtag}
                            />
                        </Field>

                        <Field
                            label={'Вес по задаче'}
                        >
                            <div style={{width: '100px'}}>
                                <Input 
                                iconRigth={
                                    <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 19L19 5M9 7C9 8.10457 8.10457 9 7 9C5.89543 9 5 8.10457 5 7C5 5.89543 5.89543 5 7 5C8.10457 5 9 5.89543 9 7ZM19 17C19 18.1046 18.1046 19 17 19C15.8954 19 15 18.1046 15 17C15 15.8954 15.8954 15 17 15C18.1046 15 19 15.8954 19 17Z" stroke="rgb(125, 133, 146)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                }
                                type='number' 
                                value={weightValue.toString()} 
                                handlerInput={(val) => changeWeightValue(val)} 
                                />
                            </div>
                        </Field>
                    </div>

                
                </div>

            </Modal.Body>

            <div className={cl.footer}>
               
                
                <div className={cl.label}>
                    <span className={cl.labelStar}>*</span> - обязательные поля
                </div>
                    
                
                <div>

                    <Button 
                    color="primary" 
                    onClick={() => handlerSubmit()}
                    className={`${cl.footerBtn} 
                    ${cl.submitBtn}`}
                    >

                        {editTask
                        ? 'Изменить'
                        : 'Создать'
                        }

                    </Button>
                </div>
            </div>

            {formInLoad && (
                <div className={cl.modalLoader}>
                    <Spinner animation="border" variant="primary" />
                    <div className='mt-1'>Создаем задачу...</div>
                </div>
            )}
            
        </Modal>

        
    </>
    )
}