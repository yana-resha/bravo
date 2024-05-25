import {Collapse, Modal, Spinner} from 'react-bootstrap';
import cl from './CreateOKRTaskModal.module.scss';
import ReactQuill from 'react-quill';
import './CreateOKRTaskModal.scss';
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
import { Rating } from '@mui/material';
import { DatePicker, DatePickerPropValue } from '@consta/uikit/DatePicker';
import { IconArrowDown } from '@consta/icons/IconArrowDown';
import { StrategySelect } from './StrategySelect/StrategySelect';
import { IStrategyTargetShort } from '@/entities/StrategyTarget';
import { useBusinessArea } from '../libs/hooks/useBusinessArea';
import { Select } from '@consta/uikit/Select';
import { Combobox } from '@consta/uikit/Combobox';
import { useHashtags } from '../libs/hooks/useHashtags';
import { OKRItemCreateRequest, OKRItemUpdateRequest } from '@/entities/task/types/OKRItemRequestType';
import moment from 'moment';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import taskService from '@/entities/task/services/TaskService';
import { addOKRTask, updateOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { FieldToast } from '@/features/CreateTaskModal/ui/FieldToast';
import { useComplexity } from '../libs/hooks/useComplexity';

type CreateOKRTaskModalProps = {
    closeFunc: () => void;
    editTask?: OKRItemType,
}

export function CreateOKRTaskModal({closeFunc, editTask = undefined} : CreateOKRTaskModalProps) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    // запустить проверку на валидность каждого поля (отобразить для пользователя что поля заполнены не верно)
    const [verityValid, setVerityValid] = useState<boolean>(false);
    // значения
    const {nameValue, handlerChangeName, nameInvalid} = useTaskName('');
    const [responsible, setResponsible] = useState<IResponsible | null>(null);
    const [customer, setCustomer] = useState<IResponsible | null>(null);
    const [successTextArea, setSuccessTextArea] = useState('');
    const [dueDate, setDueDate] = useState<undefined | DatePickerPropValue<"date"> | Date>(undefined);
    const [startDate, setStartDate] = useState<undefined | DatePickerPropValue<"date"> | Date>(undefined);
    const [strategy, setStrategy] = useState<string | null>(null);
    const {bisinessAreaList, bisinessArea, setBisinessAreas} = useBusinessArea();
    const {hashtagValue, setHashtagValue, hashtagList, handleCreateHashtag} = useHashtags();
    const {
        complexityValue,
        handlerComplexity,
        complexityDisabled,
        differenceComplexity,
        userComplexity, 
        maxUserComplexity
    } = useComplexity(
        responsible,
        Boolean(editTask),
        editTask?.complexity ?? 0,
        editTask?.responsibles[0]
    );

    // 
    const [formInLoad, setFormInLoad] = useState<boolean>(false);
    const changeStrategy = (value: IStrategyTargetShort | string | null) => {
        if (!value) {
            setStrategy(null);
        } else {
            if (typeof value === 'string') {
                setStrategy(value)
            } else if (value.id) {
                setStrategy(value.id);
            }
        }
    }
    const [isOpenParams, setIsOpenParams] = useState<boolean>(true);
    const handlerDueDate = (date: undefined | DatePickerPropValue<"date"> | Date) => {
        setDueDate(date);
    }
    const handlerStartDate = (date: undefined | DatePickerPropValue<"date"> | Date) => {
        setStartDate(date);

        if (dueDate && moment(dueDate).isSameOrBefore(date)) {
            setDueDate(date);
        }
    }

    const setRequestForm = () => {
        let request: any = {
            login: currentUser.login,
            title: nameValue,
        }
        if (editTask) {
            request.id = editTask.id;
        }
        if (nameInvalid) return false;
        if (!responsible) return false;
        request.tags = hashtagValue && hashtagValue.map((item) => item.label);
        request.business = bisinessArea?.label ?? null;
        request.idStrategy = strategy;
        request.dueDate = dueDate ? moment(dueDate).format('YYYY-MM-DD') : undefined;
        request.startDate = startDate ? moment(startDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        request.complexity = complexityValue;
        request.responsibles = responsible ? [responsible] : [];
        request.description = successTextArea ?? '';
        request.customer = customer?.login??currentUser.login;
        return request;
    }
    const createNewTask = async (request : OKRItemCreateRequest) => {
        setFormInLoad(true);
        try {

            let response = await taskService.createOKR(request);
            if (response) {
                dispatch(addOKRTask(response));
                showInfoAlert({
                    format : 'mini', 
                    text: `Задача "${response.title}" успешно создана!`, 
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
    const updateTask = async (request : OKRItemUpdateRequest) => {
        setFormInLoad(true);
        try {

            let response = await taskService.updateOKR(request);
            if (response) {
                dispatch(updateOKRTask(response));
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
        let request = setRequestForm();
        if (request) {
            if (!editTask) {
                createNewTask(request); 
            } else {
                updateTask(request)
            }
           
        }
        if (!request) {
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
            if (editTask.tags) {
                editTask.tags.forEach(tag => handleCreateHashtag(tag));
            }
            if (editTask.dueDate) {
                handlerDueDate(new Date(moment(editTask.dueDate, 'DD.MM.YYYY').format('YYYY-MM-DD')));
            }

            if (editTask.startDate) {
                handlerStartDate(new Date(moment(editTask.startDate, 'DD.MM.YYYY').format('YYYY-MM-DD')));
            }
            if (editTask.business) {
                let item = bisinessAreaList.find(el => el.label == editTask.business);
                if (item) setBisinessAreas(item);
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

            <div className='d-flex flex-row justify-content-between align-items-center mb-3'>
                <div className={cl.modalTitle}>{editTask ? 'Редактировать задачу' : 'Добавить новую задачу'}</div>
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
                                    minDate={new Date(moment().subtract(180, 'd').format())}
                                />
                            </div>
                        </Field>
                        <Field
                            label={<>Окончание работы (дэдлайн)</>}
                        >
                            <div>
                                <DatePicker
                                    className='date-picker'
                                    dropdownClassName={cl.pickerDropdown}
                                    type="date"
                                    value={dueDate}
                                    onChange={handlerDueDate}
                                    placeholder={'Выберите дату'}
                                    minDate={startDate ? new Date(startDate) : new Date()}
                                />
                            </div>
                        </Field>
                        <Field
                            label={ <>Сложность задачи <span className={cl.labelLight}>(min 1, max 3, шаг 0.5)</span></> }
                        >
                            {!Boolean(responsible) && (
                                <FieldToast theme='warning' className='flex-grow-1' closeButton={false}>
                                    <i className="ri-error-warning-fill fs-24 me-1"></i>
                                    Сначала выберите владельца задачи
                                </FieldToast>
                            )}

                            {!Boolean(editTask) && Boolean(responsible) && differenceComplexity <= 0 && (
                                <FieldToast theme='warning' className='flex-grow-1' closeButton={false}>
                                    <i className="ri-error-warning-fill fs-24 me-1"></i>
                                    У сотрудника нет свободных "звезд"
                                </FieldToast>
                            )}

                            {Boolean(responsible) && (Boolean(editTask) || differenceComplexity > 0) && (
                                <div className={cl.ratingBlock}>
                                    <Rating
                                        className={`${cl.ratingStars} ratingStars`}
                                        name="simple-controlled"
                                        defaultValue={1}
                                        
                                        value={complexityValue}
                                        precision={0.5}
                                        size="large"
                                        max={3}
                                        disabled={complexityDisabled}
                                        onChange={(_, newValue) => {
                                            if (newValue === null) return;
                                            handlerComplexity(newValue);
                                        }}
                                    />
                                    <span className={`rounded-circle ${cl.starValue} ${cl.successValue}`}>
                                        {userComplexity}/{maxUserComplexity}
                                    </span>
                                </div>
                            )}
                        </Field>
                    </div>

                    <div>
                        
                        <div
                            className={`d-flex mb-3 flex-row align-items-center position-relative ${cl.arrowIconBlock} ${isOpenParams ? cl.transformIcon : ''}`}
                            onClick={() => setIsOpenParams(!isOpenParams)}
                        >
                            <span className='fs-14 me-2'>{isOpenParams ? 'Скрыть необязательные параметры' : 'Необязательные параметры'}</span>
                            <IconArrowDown size='xs' />
                        </div>
                        <Collapse in={isOpenParams} >
                            <div>
                                <div className={`${cl.grid2Column} mb-3`}>

                                    <Field
                                        label={
                                            <>Привязка к стратегической цели</>
                                        }
                                    >
                                        <StrategySelect
                                        defaultValue={editTask?.idStrategy ? {id: editTask?.idStrategy, title: editTask.titleStrategy??""} : undefined}
                                        setValue={changeStrategy} 
                                        />
                                    </Field>


                                    <Field
                                        label={
                                            <>Направление бизнеса</>
                                        }
                                    >

                                        <Select
                                            placeholder="Выберите направление"
                                            className={cl.typeSelect}
                                            items={bisinessAreaList}
                                            // disabled={modalType === 'edit' || (createSettings && 'type' in createSettings)}
                                            value={bisinessArea}
                                            onChange={setBisinessAreas}
                                            dropdownClassName='selectDropdown'
                                            size='l'
                                        />
                                    </Field>
                                    
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

                                </div>
                            </div>
                        </Collapse>

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
                        {editTask ? "Изменить" : "Создать"}
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