/* Hooks */
import { useEffect, useRef, useState } from 'react';
import { usePriority } from '../libs/hooks/okr/usePriority';
import { useModalTitle } from '../libs/hooks/useModalTitle';
import { useTaskName } from '../libs/hooks/useTaskName';
import { useResponsible } from '../libs/hooks/okr/useResponsible';
import { useOkrDeadline } from '../libs/hooks/okr/useOkrDeadline';
import { useSelectStrategicTarget } from '../libs/hooks/okr/useSelectStrategicTarget';
import { useUnite } from '../libs/hooks/metrika/useUnite';
import { useStars } from '../libs/hooks/okr/useStars';
import { useIndicator } from '../libs/hooks/metrika/useIndicator';
import { useMetrikaDescription } from '../libs/hooks/metrika/useMetrikaDescription';
import { usePeriod } from '../libs/hooks/metrika/usePeriod';
import { useActionMetrika } from '../libs/hooks/metrika/useActionMetrika';
import { useMetricValues } from '../libs/hooks/metrika/useMetricValues';
import { useTaskType } from '../libs/hooks/useTaskType';
import { useEditForm } from '../libs/hooks/useEditForm';
import { useSelectOKR } from '../libs/hooks/kr/useSelectOKR';
import { useBusinessArea } from '../libs/hooks/useBusinessArea';
import { useHashtags } from '../libs/hooks/useHashtags';
import { Switch } from '@consta/uikit/Switch';

/* Redux */
import { useSelector, useDispatch } from 'react-redux';

/* API */
import { createKR, updateKRItem } from '@/entities/task/api/krAPI';

/* Slices */
import { addChldrnOKRTask, addOKRTask, updateOKRTask} from '@/entities/task/model/slices/okrListSlice';
import { addChildTask, addChldrnChildTask, updateChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { addStrategyMetric, updateStrategyMetric } from '@/widgets/MetricList/model/slices/StrategicMetricSlice';
import { addMetric, updateMetricInList } from '@/widgets/MetricList/model/slices/MetricListSlice';

/* Services */
import taskService from '@/entities/task/services/TaskService';
import metricaApiService from '@/entities/metrica/services/MetricaApiService';
import strategyMetricaServiceAPI from '@/entities/strategyMetrica/services/StrategyMetricaApIService';

/* Types */
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { ModalActionType } from '../types/ModalActionType';
import { SelectStrategyGroupType} from '../types/SelectStrategyDataTypes';
import { ModalProps } from '../types/ModalPropsType';

/* Components */
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Collapse, Spinner } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import Rating from '@mui/material/Rating';
import { Select } from '@consta/uikit/Select';
import { DatePicker } from '@consta/uikit/DatePicker';
import { Button } from '@/shared/ui/Button';
import { TaskDescriptionModal } from '@/shared/ui/TaskDescriptionModal';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';
import { InvalidInputText } from '@/shared/ui/InvalidInputText';
import { SpinnerButton } from '@/shared/ui/SpinnerButton';
import { QuartalSelectGroup } from '@/shared/ui/QuartalSelectGroup';
import { Input } from '@/shared/ui/Input';
import { Field } from '@/shared/ui/Field';
import { FieldToast } from './FieldToast';
import { SelectStrategy, SelectStrategyPropsType } from './SelectStrategy/SelectStrategy';
import { MetricValuesField } from './MetricValuesField/MetricValuesField';
import { ResponsibleField } from './ResponsibleField';
import { Combobox } from '@consta/uikit/Combobox';

/* Data */
import { selectStrategyGrops } from '../data/metrika/metrikaSelectStrategy';

/* Utils */
import moment, { months } from 'moment';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';

/* Styles */
import cl from './createTaskModal.module.scss';
import './createTaskModal.scss';

/* Images & Icons */
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import { IconArrowDown } from '@consta/icons/IconArrowDown';
import { IconCalendar } from '@consta/icons/IconCalendar';
import { AutoCompleteInput } from '@/features/AutoCompleteInput';
import { bgThemeEnum } from '@/shared/ui/Badge/types/badgeProps';
import { Badge } from '@/shared/ui/Badge';
import { useWeight} from '../libs/hooks/useWeigth';


function CreateTaskModal (props : ModalProps) {
    const {
        closeFunc, 
        taskID = null, 
        type = null, 
        createSettings = {}
    } = props;
    
    const dispatch = useDispatch();
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const ref = useRef(null);

    const {taskType, changeTaskType, taskTypeList} = useTaskType();
    const {bisinessAreaList, bisinessArea, setBisinessAreas} = useBusinessArea();
    const {hashtagValue, setHashtagValue, hashtagList, handleCreateHashtag} = useHashtags();
    const {unit, unitHandler, unitInvalid, unitList} = useUnite(null);

    const [modalType, setModalType] = useState<ModalActionType>('create');
    const [optionalCollapse, setOptionalCollapse] = useState(false);
    const [metrikaParamsCollapse, setMetrikaParamsCollapse] = useState(true);
    const [openDescModal, setOpenDescModal] = useState(false);
    const [formInLoad, setFormInLoad] = useState(false);

    const modalTitle = useModalTitle(taskType, modalType);
    const {editData, editDataLoading, editDataError, taskResponsibles} = useEditForm(taskID, taskType, modalType);
    // запустить проверку на валидность каждого поля (отобразить для пользователя что поля заполнены не верно)
    const [verityValid, setVerityValid] = useState<boolean>(false);
    // OKR
    const {initialResponsibles, setInitialResponsibles,responsibles ,responsibleList, respError, respInvalid,respListInLoad , responsibleHandler} = useResponsible(taskType, modalType);
    // const [currentRespList, setCurrentRespList] = useState<any>(responsibleList);
    const {nameValue, handlerChangeName, nameInvalid} = useTaskName('');
    const [successTextArea, setSuccessTextArea] = useState('');
    const {okrDeadline, deadlineDisabled, handlerDeadline} = useOkrDeadline(undefined, responsibles[0]);
    const {taskPriority, priorityBtnDisabled,priorityHandler, btnGroupDisabled} = usePriority(editData && editData.taskType === 'OKR' ? editData.priority : 0 , responsibles[0], modalType, taskResponsibles[0]);
    const {strategicHandler, strategicTarget, strategicList, strategicListLoad} = useSelectStrategicTarget(taskType);
    const {starsValue, handlerStars, starDisabled, differenceComplexity, userComplexity, maxUserComplexity} = useStars(responsibles[0], modalType === 'edit', editData?.taskType === 'OKR' ? editData?.complexity : 0, taskResponsibles[0]);
    
    // Metrics
    const [indicatorDefaultValue, setIndicatorDefaultValue] = useState<SelectStrategyPropsType['defaultValue']>(null)
    const {indicatorInvalid,indicatorItems, indicatorValues, changeIndicatorValues, indicatorListLoading} = useIndicator(taskType);
    const [selectStrategies, setSelectStrategies] = useState<any[]>([]);
    const {metrikaDescValue, metrikaDescInvalid, metrikaDescHandler, setNotDescValidate, notDescValidate} = useMetrikaDescription();
    const {metrikaPeriodList, metrikaPeriod, metrikaPeriodHandler} = usePeriod();
    const {metricValues, setMetricValues} = useMetricValues();
    const [typeCalculationResults, setTypeCalculationResults] = useState<string>('total');
    const {
        setMinMetricaStartDate,
        metrikaStart, 
        metrikaEnd, 
        metrikaStartHandler, 
        metrikaEndHandler,
        metrikaStartMin,
        metrikaEndMin,
        metrikaEndCheckValue,
        changeMetrikaEndCheckValue,
    } = useActionMetrika({period: metrikaPeriod});
    // KR 
    const [weigthSwitchValue, setWeigthSwitchValue] = useState(false);
    const {weightValue, changeWeightValue} = useWeight();
    const {selectOKRHandler, selectedOKR, okrList, okrListLoad, countOKRListLoading} = useSelectOKR(responsibles, respListInLoad, respError, taskType);
    // Написать с нуля получение списка задач для привязки

    const addSelectStrategies = (defaultValue: {id: number | string, type: SelectStrategyGroupType['type']} | null | null = null) => {
        setSelectStrategies((prev) => {
            return [...prev, {
                [Math.floor(Math.random() * 1000) + 1] : true,
                defaultValue: defaultValue,
            }]
        });
    }

    const removeSelectStrategies = (index: number | string ) => {
        let currentArr = selectStrategies;
        currentArr = currentArr.map(el => {
            if (el[index]) {
                el[index] = false;
            }
            return el;
        })
        setSelectStrategies(currentArr);
    }

    useEffect(() => {
        setSelectStrategies([]);
    }, [taskType]);

    useEffect(() => {
        if (responsibles[0]) {
            if (currentUser.login !== responsibles[0].login) {
                setOptionalCollapse(true)
            } else {
                setOptionalCollapse(false);
            }
        }
    }, [responsibles]);

    useEffect(() => {
        if (type && taskID) {
            changeTaskType(type);
            setModalType('edit');
        } 

        if (createSettings) {
            if (createSettings.type) {
                changeTaskType(createSettings.type);
            }

            if (createSettings.initialResponsibles) {
                setInitialResponsibles(createSettings.initialResponsibles);
            }
        }
    }, []);

    useEffect(() => {
        if (editData) {
            let deadline: undefined | Date = editData.dueDate ? new Date(moment(editData.dueDate, 'DD.MM.YYYY').format('YYYY-MM-DD')) : undefined;
            handlerChangeName(editData.title);
            if (taskType?.id === 'OKR' && editData.taskType === 'OKR') {
                setInitialResponsibles(editData.responsibles);
                setSuccessTextArea(editData.description ?? "");
                handlerDeadline(deadline);
                if (editData.weight > 0) {
                    setWeigthSwitchValue(true);
                    changeWeightValue(editData.weight);
                }
                if (editData.business) {
                    let business = bisinessAreaList.find(el => el.label == editData.business);
                    if (business) setBisinessAreas(business);
                }

                if (editData.tags && editData.tags.length > 0) {
                    editData.tags.forEach((tag: string) => handleCreateHashtag(tag));
                }
            } else if (taskType?.id === 'KR') {

                if (editData.weight > 0) {
                    setWeigthSwitchValue(true);
                    changeWeightValue(editData.weight);
                }

                if (editData.tags && editData.tags.length > 0) {
                    editData.tags.forEach((tag: string) => handleCreateHashtag(tag));
                }
               
                if (editData.business) {
                    let business = bisinessAreaList.find(el => el.label == editData.business);
                    if (business) setBisinessAreas(business);
                }
            
                setInitialResponsibles(editData.responsibles);
                setSuccessTextArea(editData.description ?? "");
                handlerDeadline(deadline);
                
            } else if ((taskType?.id === 'strategyMetric' || taskType?.id === 'metric') && (editData.taskType === 'metric' || editData.taskType === 'strategyMetric')) {
                
                setInitialResponsibles(editData.responsibles);
                metrikaDescHandler(editData.description ?? "");
                if (!editData.description || editData.description.length == 0) {
                    setNotDescValidate(true);
                }
                
                unitHandler(editData.unit);
                metrikaPeriodHandler(editData.period);
                editData.indicators?.forEach((el: any, index: number) => {
                    if (index === 0) setIndicatorDefaultValue(el);
                    if (index > 0) addSelectStrategies(el);
                });

                let minDate = moment(editData.createDate, 'DD.MM.YYYY').format('YYYY-MM-DD')
                setMinMetricaStartDate(minDate);
                if (editData.startDate) {
                    let date = moment(editData.startDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                    if (date !== 'Invalid date') {
                        metrikaStartHandler(date);
                    }   
                }
                if (editData.dueDate) {
                    let date = moment(editData.dueDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                    if (date !== 'Invalid date') {
                        metrikaEndHandler(date);
                    }   
                }
            }
        }
    }, [editData]);

    useEffect(() => {
        if (strategicList.length > 0 && editData?.taskType === 'OKR' && currentUser.role === 'super-user') {
            strategicHandler(editData.idStrategy ?? null);
        } else if (createSettings && createSettings.idStrategy) {
            strategicHandler(createSettings.idStrategy);
        }
    }, [strategicList]);

    // okr list при перерендере сменить выбранную привязку к okr
    useEffect(() => {
        if (okrList && taskType?.id === 'KR' && editData) {
            selectOKRHandler(selectedOKR?.id ?? editData.idParent);
        } else if (okrList && taskType?.id === 'KR' && !editData) {
            selectOKRHandler(selectedOKR?.id ?? null);
        } 
        if (okrList && currentUser.role !== 'super-user' && editData?.taskType === 'OKR' && countOKRListLoading === 1) {
            selectOKRHandler(editData.idParent ?? null);
        } 

        if (createSettings.parentID && createSettings.type == 'KR') {
            selectOKRHandler(createSettings.parentID);
        }
    }, [okrList]);

    useEffect(() => {
        if (editDataError) closeFunc();
    }, [editDataError])

    const setRequestForm = () => {
        let request: any = {
            login: currentUser.login,
            title: nameValue
        }

        if (modalType === 'edit') request.id = taskID;

        if (taskType?.id === 'OKR') {
            if (nameInvalid) return false;
            // if (respInvalid) return false;

            request.responsibles = responsibles;
            request.description = successTextArea ?? '';
            request.complexity = starsValue;
            request.priority = taskPriority;
            request.dueDate = okrDeadline ? moment(okrDeadline).format('YYYY-MM-DD') : undefined;
            request.idStrategy= strategicTarget?.id ?? null;
            request.idParent = selectedOKR?.id ?? null;
            request.business = bisinessArea?.label ?? null;
            request.tags = hashtagValue && hashtagValue.map((item) => item.label);
            request.weight = weightValue;
        } 
        else if (taskType?.id === 'KR') {
            if (nameInvalid) return false;
            // if (respInvalid) return false;
            request.weight = weightValue;
            request.complexity = starsValue;
            request.responsibles = responsibles;
            request.description = successTextArea ?? '';
            request.dueDate = okrDeadline ? moment(okrDeadline).format('YYYY-MM-DD') : undefined;
            request.idParent = selectedOKR?.id ?? null;
            request.business = bisinessArea?.label ?? null;
            request.tags = hashtagValue && hashtagValue.map((item) => item.label);
        }
        else if (taskType?.label === 'Метрика' || taskType?.label === 'Стратегическая метрика') {
            if (nameInvalid) return false;
            if (unitInvalid) return false;
            if (indicatorInvalid) return false;
            if (metrikaDescInvalid) return false;

            request.responsibles = responsibles;
            request.unit = unit?.label;
            request.description = metrikaDescValue;
            request.indicators = JSON.stringify(indicatorValues.map(el => {
                let elType = el.type == 'strategyMetric' ? 'metrics' : el.type;
                return {
                    id: el.id,
                    type: elType,
                }
            }));
            request.startDate = metrikaStart;
            request.dueDate = metrikaEnd;
            request.period = metrikaPeriod?.id;
            request.metricValues = JSON.stringify(metricValues.map(el => {

                if (el.month) {
                    el.typeValue = 'month';
                } else if (el.quartal) {
                    el.typeValue = 'quartal';
                }
                
                delete el['index'];
                return el;
            }));
            request.totType = typeCalculationResults;
            request.taskType = taskType?.label === 'Стратегическая метрика' ? 'strategyMetric' : 'metric';
        }
        return request;
    }
    
    const createNewTask = async (request : any ) => {
        setFormInLoad(true);
        try {
            let response;
            if (taskType?.id == "OKR") response = await taskService.createOKR(request);
            else if (taskType?.id == "metric") response = await metricaApiService.createMetrica(request);
            else if (taskType?.id == 'strategyMetric') response = await strategyMetricaServiceAPI.createStrategyMetric(request);
            else if (taskType?.id == 'KR') response = await createKR(request);
         
            if (response) {
                if (taskType?.id === "OKR" || taskType?.id == 'KR') {
                    if (response.idParent) {
                        dispatch(addChildTask(response));
                    } else {
                        dispatch(addOKRTask(response));
                    }

                    // если это вложенная задача диспатчу это в редакс чтобы в списке появилась стрелочка для развертывания если ее не было
                    if (response.idParent) {
                        dispatch(addChldrnChildTask(response.idParent));
                        dispatch(addChldrnOKRTask(response.idParent));
                    }
                    
                }
                if (taskType?.id === "strategyMetric") {
                    dispatch(addStrategyMetric(response));
                }
                 
                if (taskType?.id === "metric") {
                    dispatch(addMetric(response))
                }
                

                showInfoAlert({
                    format : 'mini', 
                    text: `Задача "${response.title}" успешно создана!`, 
                    type: 'success',
                });
                closeFunc();
            }
        } catch (error: any) {
            console.error(error);
            showInfoAlert({
                format : 'full', 
                text: error.message, 
                type: 'error',
            });
        } finally {
            setFormInLoad(false);
        }
    }

    const updateTask = async (request : any ) => {
        setFormInLoad(true);
        try {
            let response;
            if (taskType?.id === "OKR") response = await taskService.updateOKR(request);
            else if (taskType?.id === "KR") response = await updateKRItem(request);
            else if (taskType?.id === "metric") response = await metricaApiService.updateMetric(request)
            else if (taskType?.id === "strategyMetric") response = await strategyMetricaServiceAPI.updateStrategyMetrica(request);
            if (response) {
                if (taskType?.id === "OKR" || taskType?.id === 'KR') {
                    
                    if (response.idParent) {
                        dispatch(updateChildTask(response))
                    } else {
                        dispatch(updateOKRTask(response));
                    }
                } else if (taskType?.id === "strategyMetric") {
                    dispatch(updateStrategyMetric(response)) 
                } else if (taskType?.id === 'metric') {
                    dispatch(updateMetricInList(response))
                }
                
                showInfoAlert({
                    format : 'mini', 
                    text: `Задача "${response.title}" успешно изменена!`, 
                    type: 'success',
                });
                closeFunc();
            }
        } catch (error: any) {
            console.log(error);
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
            if (modalType === 'create') {
                createNewTask(request);
            } else if (modalType === 'edit') {
                updateTask(request);
            }
        } else {
            showInfoAlert({
                format : 'full', 
                text: 'Пожалуйста, заполните все обязательные поля', 
                type: 'error'
            });  
        }
    };


    return (
        <>
            <Modal
                backdrop="static"
                className="taskModal"
                show={true}
                onHide={closeFunc}
                centered
                dialogClassName={cl.taskModalDialog}
                contentClassName={`${cl.taskModal}`}
                scrollable={true}
            >
                <div className='d-flex flex-row justify-content-between mb-5'>
                    <div className={cl.modalTitle}>{modalTitle}</div>
                    <Button color='light' onClick={closeFunc} className='pt-0' size='sm' title='Закрыть модальное окно'>
                        <i className="ri-close-fill fs-24"></i>
                    </Button>
                </div>

                <Modal.Body>
                    <div className={`${cl.mainContent}`}>
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
                            
                            <div className={`d-flex flex-row align-items-start mb-3`}>
                                {/* Тип задачи */}
                                <Form.Group className={`${cl.w4}`}>
                                    <Form.Label className={cl.label}>
                                        Тип задачи
                                        <span className={cl.labelStar}>*</span>
                                        <TooltipWhite
                                            position='top'
                                            content={'Кликните чтобы открыть описание типов задач'}
                                        >
                                            <Button
                                                ref={ref}
                                                onlyIcon={true}
                                                className={cl.infoBtn}
                                                onClick={() => setOpenDescModal(true)}
                                            >
                                                <i className="ri-information-line"></i>
                                            </Button>
                                        </TooltipWhite>
                                    </Form.Label>
                                    <Select
                                        placeholder="Выберите значение"
                                        className={cl.typeSelect}
                                        items={taskTypeList}
                                        disabled={modalType === 'edit' || (createSettings && 'type' in createSettings)}
                                        value={taskType}
                                        onChange={(item) => item ? changeTaskType(item.id) : changeTaskType(null)}
                                        dropdownClassName='selectDropdown'
                                        size='l'
                                    />
                                </Form.Group>

                                {/* Ответственный */}
                                {taskType && (
                                   <ResponsibleField 
                                        taskType={taskType}
                                        list ={responsibleList} 
                                        items = {initialResponsibles}
                                        handlerItem={responsibleHandler}
                                        listInLoad = {respListInLoad}
                                        showValid={respInvalid && verityValid ? true : false}
                                        validError={respInvalid}
                                        addBtn={false}
                                    />
                                )}
                            </div>
                            {taskType && (taskType.id === 'metric' || taskType.id === 'strategyMetric') && (
                                <>
                                    {/* Единица измерения */}
                                    <Form.Group className={`${cl.w4} flex-grow-1 mb-3`}>
                                        <Form.Label className={cl.label}>
                                            Единица измерения
                                            <span className={cl.labelStar}>*</span>
                                        </Form.Label>
                                        <Select
                                            placeholder="Выберите единицу измеренения"
                                            className={`${unitInvalid && verityValid ? 'invalid' : ''}`}
                                            items={unitList}
                                            value={unit}
                                            onChange={(item) => unitHandler(item?.id)}
                                            dropdownClassName='selectDropdown'
                                            size='l'
                                            renderItem={({ item, active, hovered, onClick, onMouseEnter, ref }) => (
                                                <div
                                                    aria-selected={active}
                                                    onMouseEnter={onMouseEnter}
                                                    onClick={onClick}
                                                    className={`${cl.uniteOption} ${active ? cl.uniteActive : ''}`}
                                                >
                                                    <span className='me-2'>
                                                        {item.icon}
                                                    </span>
                                                    {item.label}
                                                </div>
                                            )}
                                        />
                                        {unitInvalid && verityValid && <InvalidInputText className='ps-1'>{unitInvalid}</InvalidInputText>}
                                    </Form.Group>

                                    {/* Привязка к показателю */}
                                    <div className={`d-flex flex-row align-items-start mb-3`}>
                                        <Form.Group className={`${cl.w4}`}>
                                            <Form.Label className={cl.label}>
                                                {taskType.id == 'metric' ? 'Привязка к показателю' : 'Привязка к стратегической цели'}
                                                <span className={cl.labelStar}>*</span>
                                            </Form.Label>
                                            <SelectStrategy
                                                placeholder={taskType.id === 'metric' ? 'Выберите показатель' : 'Выберите стратегическую цель'}
                                                isLoading={indicatorListLoading}
                                                closeBtn={false}
                                                items={indicatorItems}
                                                defaultValue={indicatorDefaultValue}
                                                groups={selectStrategyGrops}
                                                changeIndicatorValues={changeIndicatorValues}
                                            />
                                            {indicatorInvalid && verityValid && <InvalidInputText className='ps-1'>{indicatorInvalid}</InvalidInputText>}
                                            {selectStrategies.map(el => {        
                                                let show = Object.values(el)[0];
                                                if (show) {
                                                    return (
                                                        <SelectStrategy
                                                            isLoading={indicatorListLoading}
                                                            closeBtn={true}
                                                            items={indicatorItems}
                                                            groups={selectStrategyGrops}
                                                            changeIndicatorValues={changeIndicatorValues}
                                                            closeFunc={removeSelectStrategies}
                                                            key={Object.keys(el)[0]}
                                                            index={Object.keys(el)[0] ?? 0}
                                                            className='mt-1 mb-1'
                                                            defaultValue={el['defaultValue']??null}
                                                        />
                                                    )
                                                } else {
                                                    return <></>
                                                }
                                            })}
                                            <div>
                                                <Button color='clear'
                                                    className={cl.addPeriodBtn}
                                                    onClick={() => addSelectStrategies(null)}
                                                >
                                                    <i className="bx bx-plus me-1" ></i>
                                                    Добавить показатель
                                                </Button>
                                            </div>
                                        </Form.Group>

                                        <Form.Group className={`${cl.w4} flex-grow-1 ms-5`}>
                                            <Form.Label className={cl.label}></Form.Label>
                                            <FieldToast theme='primary' className='w-100'>
                                                <i className="ri-error-warning-fill fs-24 me-1"></i>
                                                Финансовая дирекция (ФД) проводит системную работу по расчету показателей метрик
                                                После того метрика будет создана, она отправится на верификацию в ФД. Если у сотрудника ФД будет вопрос - с вами свяжутся для уточнения деталей.
                                                После успешного согласования - ФД начнет производить расчеты
                                            </FieldToast>
                                        </Form.Group>
                                    </div>

                                    {/* Описание */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className={`${cl.label} d-flex flex-row`}>
                                            <span className='me-3'>
                                                Описание
                                                <span className={cl.labelStar}>*</span>
                                            </span>
                                            <Form.Check // prettier-ignore
                                                type={'checkbox'}
                                                id={`check-desc`}
                                            >
                                                <Form.Check.Input
                                                    checked={notDescValidate}
                                                    type={'checkbox'}
                                                    onChange={(e: any) => {
                                                        setNotDescValidate(e.target.checked);
                                                    }}
                                                />
                                                <Form.Check.Label className='fw-normal'>
                                                    Не могу придумать описание метрики / Название метрики говорит само за себя
                                                </Form.Check.Label>
                                            </Form.Check>
                                        </Form.Label>
                                        <div className='w-100'>
                                            <TextareaAutosize
                                                disabled={notDescValidate}
                                                className={`form-control ${cl.textarea} ${metrikaDescInvalid && verityValid ? cl.invalid : ''}`}
                                                minRows={3}
                                                maxRows={10}
                                                placeholder='Опишите логику, для того чтобы сотрудник финансовой дирекции смог производить расчет метрики'
                                                value={metrikaDescValue}
                                                onInput={(e: any) => metrikaDescHandler(e.target.value)}
                                            />
                                        </div>
                                        {metrikaDescInvalid && verityValid && <InvalidInputText className='ps-1'>{metrikaDescInvalid}</InvalidInputText>}
                                    </Form.Group>

                                    {/* Необязательные параметры */}
                                    <div>
                                        <div className='d-flex flex-row'>
                                            <div
                                                className={`d-flex flex-row align-items-center position-relative ${cl.arrowIconBlock} ${metrikaParamsCollapse ? cl.transformIcon : ''}`}
                                                onClick={() => setMetrikaParamsCollapse(!metrikaParamsCollapse)}
                                            >
                                                <span className='fs-14 me-2'>{metrikaParamsCollapse ? 'Скрыть необязательные параметры' : 'Необязательные параметры'}</span>
                                                <IconArrowDown size='xs' />
                                            </div>
                                        </div>

                                        <Collapse in={metrikaParamsCollapse}>
                                            <div className={cl.metrikaParams}>
                                                <div className={`${cl.metrikaDateRow}`}>
                                                    {/* Периодичность обновления фактов метрики */}
                                                    <Form.Group>
                                                        <Form.Label className={cl.label}>
                                                            Периодичность обновления фактов метрики
                                                        </Form.Label>
                                                        <Select
                                                            placeholder="Выберите показатель"
                                                            className={cl.typeSelect}
                                                            items={metrikaPeriodList}
                                                            value={metrikaPeriod}
                                                            onChange={(item) => metrikaPeriodHandler(item?.id)}
                                                            dropdownClassName='selectDropdown'
                                                            size='l'
                                                        />
                                                    </Form.Group>

                                                    {/* Начало действия метрики */}
                                                    <Form.Group>
                                                        <Form.Label className={cl.label}>
                                                            Начало действия метрики
                                                        </Form.Label>
                                                        <div>
                                                            {metrikaPeriod?.id === 'Ежемесячно' && (
                                                                <DatePicker
                                                                    className='date-picker'
                                                                    dropdownClassName={cl.pickerDropdown}
                                                                    type="month"
                                                                    value={metrikaStart ? new Date(metrikaStart) : null}
                                                                    onChange={(value: any) => {
                                                                        const dateStr = value ? moment(value).format('YYYY-MM-DD') : null;
                                                                        metrikaStartHandler(dateStr);
                                                                    }}
                                                                    placeholder={'Выберите месяц'}
                                                                    rightSide={IconCalendar}
                                                                    minDate={new Date(metrikaStartMin)}
                                                                    size='l'
                                                                />
                                                            )}

                                                            {metrikaPeriod?.id !== 'Ежемесячно' && (
                                                                <QuartalSelectGroup
                                                                    clear={metrikaStart ? false : true}
                                                                    setValue={metrikaStartHandler} 
                                                                />
                                                            )}
                                                        </div>
                                                    </Form.Group>

                                                    {/* Окончание действия метрики */}
                                                    <Form.Group>
                                                        <Form.Label className={cl.label}>
                                                            Окончание действия метрики
                                                        </Form.Label>
                                                        <div className='mb-1'>
                                                            {metrikaPeriod?.id === 'Ежемесячно' && !metrikaEnd && (
                                                                <DatePicker
                                                                    disabled={metrikaEndCheckValue}
                                                                    className={`date-picker ${metrikaEndCheckValue ? 'disabled' : ""}`}
                                                                    dropdownClassName={cl.pickerDropdown}
                                                                    type="month"
                                                                    value={undefined}
                                                                    onChange={(value: any) => {
                                                                        const dateStr = value ? moment(value).format('YYYY-MM-DD') : undefined;
                                                                        metrikaEndHandler(dateStr);
                                                                    }}
                                                                    placeholder={'Выберите месяц'}
                                                                    rightSide={IconCalendar}
                                                                    minDate={metrikaEndMin ? new Date(metrikaEndMin) : new Date()}
                                                                    size='l'
                                                                />
                                                            )}
                                                            {/* Ежемесячно */}
                                                            {metrikaPeriod?.id === 'Ежемесячно' && metrikaEnd && (
                                                                <DatePicker
                                                                    disabled={metrikaEndCheckValue}
                                                                    className='date-picker'
                                                                    dropdownClassName={cl.pickerDropdown}
                                                                    type="month"
                                                                    value={new Date(metrikaEnd)}
                                                                    onChange={(value: any) => {
                                                                        const dateStr = value ? moment(value).format('YYYY-MM-DD') : undefined;
                                                                        metrikaEndHandler(dateStr);
                                                                    }}
                                                                    placeholder={'Выберите месяц'}
                                                                    rightSide={IconCalendar}
                                                                    minDate={metrikaEndMin ? new Date(metrikaEndMin) : new Date()}
                                                                    size='l'
                                                                />

                                                            )}
                                                            {/* Квартально */}
                                                            {metrikaPeriod?.id !== 'Ежемесячно' && (
                                                                <QuartalSelectGroup
                                                                    disabled={metrikaEndCheckValue}
                                                                    clear={metrikaEnd ? false : true}
                                                                    setValue={metrikaEndHandler}
                                                                />
                                                            )}
                                                        </div>

                                                        <Form.Check // prettier-ignore
                                                            type={'checkbox'}
                                                            id={`check-deadline`}
                                                        >
                                                            <Form.Check.Input
                                                                checked={metrikaEndCheckValue}
                                                                onClick={() => changeMetrikaEndCheckValue(!metrikaEndCheckValue)}
                                                                onChange={(e: any) => {
                                                                    if (e.target.checked) {
                                                                        metrikaEndHandler(undefined);
                                                                    }
                                                                }}
                                                                type={'checkbox'} />
                                                            <Form.Check.Label className={`${cl.label} fw-normal fs-16`}>
                                                                Без срока окончания
                                                            </Form.Check.Label>
                                                        </Form.Check>
                                                    </Form.Group>
                                                </div>
                                                <div className='mb-3 d-flex flex-column'>
                                                    <Form.Label className={cl.label}>
                                                        Тип подсчета результатов:
                                                    </Form.Label>
                                                    <Form.Check
                                                        onChange={() => setTypeCalculationResults('total')}
                                                        checked={typeCalculationResults === 'total' ? true : false}
                                                        className={`${cl.label} fw-normal`}
                                                        label="за период"
                                                        name="group1"
                                                        type={'radio'}
                                                        id={`за период`}
                                                    />
                                                    <Form.Check
                                                        checked={typeCalculationResults === 'cumulative' ? true : false}
                                                        onChange={() => setTypeCalculationResults('cumulative')}
                                                        className={`${cl.label} fw-normal`}
                                                        label="накопленный по итогам"
                                                        name="group1"
                                                        type={'radio'}
                                                        id={`накопленный по итогам`}
                                                    />
                                                </div>
                                                <MetricValuesField 
                                                    defaultValues={editData && editData.taskType !== 'KR' ? editData.metricValues : []}
                                                    metricValues={metricValues} 
                                                    setMetricValues={setMetricValues} 
                                                    unit={unit}
                                                    period={metrikaPeriod} 
                                                />
                                            </div>
                                        </Collapse>
                                    </div>
                                </>
                            )}

                            {/* Критерии успеха и приоритеты */}
                            {taskType && (taskType.id === 'OKR' || taskType.id === 'KR') && (
                                <Form.Group className="mb-3">
                                    <Form.Label className={`${cl.label} d-flex flex-row`}>
                                        <span className='me-2'>Критерии успеха и приоритеты</span>
                                        <FieldToast theme='primary' className='flex-grow-1'>
                                            <i className="ri-error-warning-fill fs-24 me-1"></i>
                                            Дополнительные параметры может редактировать только руководитель владельца задачи
                                        </FieldToast>
                                    </Form.Label>
                                    <div className='w-100'>
                                        <TextareaAutosize
                                            className={`form-control ${cl.textarea}`}
                                            minRows={3}
                                            maxRows={10}
                                            placeholder='Укажите критерии успехи выполнения задачи, детальное описание приоритетов для владельца задачи '
                                            value={successTextArea}
                                            onInput={(e: any) => setSuccessTextArea(e.target.value)}
                                        />
                                    </div>
                                </Form.Group>
                            )}

                            {taskType && (taskType.id === 'OKR' || taskType.id === 'KR') && (
                                <div className={`d-flex flex-row align-items-start justify-content-between mb-3`}>
                                    {/* Направление бизнеса */}
                                    <Form.Group className={`${cl.w4}`}>
                                        <Form.Label className={cl.label}>Направление бизнеса</Form.Label>
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
                                    </Form.Group>

                                    {/* Хэштеги */}
                                    <Form.Group className={`${cl.w4}`}>
                                        <Form.Label className={cl.label}>Хэштеги</Form.Label>
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
                                    </Form.Group>
                                </div>
                            )}
                            

                            {taskType && (taskType.id === 'OKR' || taskType.id === 'KR') && (
                                <div>
                                    <div className='d-flex flex-row'>
                                        <div
                                            className={`d-flex flex-row align-items-center position-relative ${cl.arrowIconBlock} ${optionalCollapse ? cl.transformIcon : ''}`}
                                            onClick={() => { setOptionalCollapse(!optionalCollapse) }}
                                        >
                                            <span className='fs-14 me-2'>
                                                {optionalCollapse ? 'Скрыть дополнительные параметры' : 'Дополнительные параметры'}
                                            </span>
                                            <IconArrowDown size='xs' />
                                        </div>

                                        {optionalCollapse && (
                                            <FieldToast theme='primary' className='flex-grow-1'>
                                                <i className="ri-error-warning-fill fs-24 me-1"></i>
                                                Дополнительные параметры может редактировать только руководитель владельца задачи
                                            </FieldToast>
                                        )}
                                    </div>

                                    <Collapse in={optionalCollapse}>
                                        <div className={cl.optionalBlock}>
                                            <div className='d-flex flex-row align-items-start mb-3'>
                                                <Form.Group className={`${cl.w4} me-5`}>
                                                    {/* Привязка к стратегической цели */}
                                                    {taskType && taskType.id === 'OKR' && (
                                                        <>
                                                            <Form.Label className={cl.label}>
                                                                Привязка к стратегической цели
                                                            </Form.Label>
                                                            <Select
                                                                getItemLabel={(item) => item.title}
                                                                placeholder="Выберите цель"
                                                                className={cl.typeSelect}
                                                                items={strategicList}
                                                                value={strategicTarget}
                                                                onChange={(item) => strategicHandler(item?.id ?? null)}
                                                                dropdownClassName={`selectDropdown ${strategicListLoad ? 'load' : ''}`}
                                                                disabled={currentUser.login === responsibles[0]?.login ? true : false}
                                                                size='l'
                                                            />
                                                        </>
                                                    )}

                                                    {/* Привязка к задаче */}
                                                    {taskType && taskType.id === 'KR' && (
                                                        <>

                                                            <Field
                                                                label={'Привязка к задаче'}
                                                                className={`mb-3`}
                                                            >
                                                                <AutoCompleteInput 
                                                                    getItemID={'id'}
                                                                    getItemLabel={'title'}
                                                                    placeholder={'Выберите задачу'}
                                                                    isListLoad={okrListLoad}
                                                                    list={okrList} 
                                                                    disabled={currentUser.login === responsibles[0]?.login ? true : false}
                                                                    setValues={(item) => {
                                                                        selectOKRHandler(item?.id ?? null)
                                                                    }}
                                                                    defaultValue={selectedOKR}
                                                                    CustomItem={({item, handlerClick, active}) => {
                                                                        return (
                                                                          <div
                                                                            onClick={() => {
                                                                              handlerClick(item.id)
                                                                            }}
                                                                            className={`${cl.listItem} d-flex`}
                                                                            >
                                                                                <div className='d-flex flex-row justify-content-between align-items-center w-100 mb-1'>
                                                                                    <div>{item.title}</div>
                                                                                    <Badge theme={bgThemeEnum.lightBlue} title='Тип задачи'>{item.taskType}</Badge>
                                                                                    
                                                                                </div>
                                                                                <div className='d-flex flex-row align-items-center'>
                                                                                    <img src={item.responsibles[0]?.avatar ? item.responsibles[0].avatar : defaultAvatar} alt="" className='rounded-circle avatar-xxs me-2' />
                                                                                    <div className={cl.itemType}>{item.responsibleFIO??'Неопределен'}</div>
                                                                                </div>
                                                                                
                                                                            </div>
                                                                        )
                                                                    }}
                                                                />
                                                            </Field>

                                                            
                                                            
                                                        </>
                                                    )}
                                                </Form.Group>

                                                {/* Сложность задачи */}
                                                {taskType && (
                                                    <Form.Group className={`${cl.w4}`}>
                                                        <Form.Label className={cl.label}>
                                                            Сложность задачи <span className={cl.labelLight}>(min 1, max 3, шаг 0.5)</span>
                                                        </Form.Label>
                                                        <div>
                                                            {!Boolean(responsibles[0]) && (
                                                                <FieldToast theme='warning' className='flex-grow-1' closeButton={false}>
                                                                    <i className="ri-error-warning-fill fs-24 me-1"></i>
                                                                    Сначала выберите владельца задачи
                                                                </FieldToast>
                                                            )}
                                                            {Boolean(responsibles[0]) && differenceComplexity <= 0 && (
                                                                <FieldToast theme='warning' className='flex-grow-1' closeButton={false}>
                                                                    <i className="ri-error-warning-fill fs-24 me-1"></i>
                                                                    У сотрудника нет свободных "звезд"
                                                                </FieldToast>
                                                            )}
                                                            {Boolean(responsibles[0]) && differenceComplexity > 0 && (
                                                                <div className={cl.ratingBlock}>
                                                                    <Rating
                                                                        className={`${cl.ratingStars} ratingStars`}
                                                                        name="simple-controlled"
                                                                        defaultValue={1}
                                                                        value={starsValue}
                                                                        precision={0.5}
                                                                        size="large"
                                                                        max={3}
                                                                        disabled={starDisabled}
                                                                        onChange={(event, newValue) => {
                                                                            if (newValue === null) return;
                                                                            handlerStars(newValue);
                                                                        }}
                                                                    />
                                                                    <span className={`rounded-circle ${cl.starValue} ${cl.successValue}`}>
                                                                        {userComplexity}/{maxUserComplexity}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Form.Group>
                                                )}                                                
                                            </div>

                                            <div className='d-flex flex-row align-items-start justify-content-between mb-3'>
                                                {/* Окончание работы (дедлайн) */}
                                                <Form.Group className={`${cl.w4} me-5`}>
                                                    <Form.Label className={cl.label}>
                                                        Окончание работы (дедлайн)
                                                    </Form.Label>
                                                    <div>
                                                        <DatePicker
                                                            className='date-picker'
                                                            dropdownClassName={cl.pickerDropdown}
                                                            type="date"
                                                            value={okrDeadline}
                                                            onChange={handlerDeadline}
                                                            placeholder={'Выберите дату'}
                                                            minDate={new Date()}
                                                            disabled={deadlineDisabled}
                                                        />
                                                    </div>
                                                </Form.Group>

                                                {/* Является ли задача приоритетной? */}
                                                {taskType && taskType.id !== 'KR' && (
                                                    <div className={cl.priorityBlock}>
                                                        <div className={`mb-3 d-flex flex-column`}>
                                                            <span className={cl.customLabel}>
                                                                Является ли задача приоритетной?
                                                            </span>
                                                            {responsibles[0] && (
                                                                <div
                                                                    className={`d-flex flex-direction-row align-items-center`}>
                                                                    <img src={responsibles[0].avatar ? responsibles[0].avatar : defaultAvatar} alt="" className='rounded-circle avatar-xs me-2' />
                                                                    <div>
                                                                        <span className={cl.respName}>{responsibles[0].fio}</span>
                                                                        <span className={`rounded-circle ${cl.starValue} ${cl.successValue}`}>
                                                                            {responsibles[0].cntComplexity ?? 0}/10
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className='mb-2'>
                                                            <Button
                                                                disabled={priorityBtnDisabled}
                                                                onClick={() => { priorityHandler(1) }}
                                                                color='outline-dark'
                                                                size='sm'
                                                                className={`${cl.priorityBtn} me-3 ${taskPriority === 1 ? cl.active : ''}`}
                                                            >
                                                                Приоритетная задача
                                                            </Button>
                                                            <Button
                                                                disabled={btnGroupDisabled}
                                                                onClick={() => { priorityHandler(0) }}
                                                                color='outline-dark'
                                                                size='sm'
                                                                className={`${cl.priorityStandartBtn}  ${taskPriority === 0 || taskPriority === null ? cl.activeStandart : ''}`}
                                                            >
                                                                Стандартная задача
                                                            </Button>
                                                        </div>

                                                        <div className='d-flex'>
                                                            <FieldToast theme='primary' className='flex-grow-1'>
                                                                <i className="ri-error-warning-fill fs-24 me-1"></i>
                                                                У одного сотрудника не может быть больше 5 приоритетных задач. Если у сотрудника уже 5 задач, то поставить новую приоритетную задачу не получится
                                                            </FieldToast>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {
                                                (taskType.id == 'KR' || taskType.id == 'OKR') && (
                                                    <>
                                                    <div className='d-flex flex-row align-items-end justify-content-between mb-3'>
                                                        
                                                        <div className={cl.w4}>
                                                            <div className={`${cl.switchWeigthContainer}`}>
                                                                <span>Установить вес по задаче</span>
                                                                <Switch 
                                                                disabled={currentUser.login === responsibles[0]?.login ? true : false}
                                                                onChange={(e) => setWeigthSwitchValue(!weigthSwitchValue)}
                                                                view="primary" 
                                                                size="l" 
                                                                checked={weigthSwitchValue}/>
                                                            </div>
                                                        </div>

                                                        {
                                                            weigthSwitchValue && (

                                                                <Field
                                                                    label={'Вес по задаче'}
                                                                    className={`${cl.w4}`}
                                                                    error={nameInvalid && verityValid ? nameInvalid : false}
                                                                >
                                                                    <div style={{width: '100px'}}>
                                                                        <Input 
                                                                        type='number' 
                                                                        value={weightValue.toString()} 
                                                                        handlerInput={(val) => changeWeightValue(val)} 
                                                                        />
                                                                    </div>
                                                                    
                                                                    
                                                                </Field>

                                                            )
                                                        }
                                                        
                                                        
                                                    </div>

                                                    </>
                                                )
                                            }
                                        </div>
                                    </Collapse>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>

                <div className={` mt-4 ${cl.footer}`}>
                    <div className='d-flex flex-row justify-content-between mb-2'>
                        <span></span>
                        {taskType && (taskType.id == 'OKR') && (
                            <Button
                                color='primary'
                                onClick={handlerSubmit}
                                size='lg'
                                disabled={formInLoad}
                            >
                                {formInLoad && <SpinnerButton classNames='me-2' />}
                                {modalType === 'edit' ? 'Сохранить изменения' : 'Создать OKR'}
                            </Button>
                        )}

                        {taskType && (taskType.id === 'KR') && (
                            <Button
                                color='primary'
                                size='lg'
                                onClick={handlerSubmit}
                            >
                                {formInLoad && <SpinnerButton classNames='me-2' />}
                                {modalType === 'edit' ? 'Сохранить изменения' : 'Создать задачу'}
                            </Button>
                        )}

                        {taskType && (taskType.id === 'metric' || taskType.id === 'strategyMetric') && (
                            <Button
                                color='primary'
                                size='lg'
                                onClick={handlerSubmit}
                            >
                                {formInLoad && <SpinnerButton classNames='me-2' />}
                                {modalType === 'edit' ? 'Сохранить изменения' : 'Создать и отправить метрику на верификацию в Финансовую дирекцию'}
                            </Button>
                        )}
                    </div>

                    {taskType && (
                        <div className={cl.label}>
                            <span className={cl.labelStar}>*</span> - обязательные поля
                        </div>
                    )}
                </div>

                {editDataLoading && (
                    <div className={cl.modalLoader}>
                        <Spinner animation="border" variant="primary" />
                        <div className='mt-1'>Загружаем данные по задаче...</div>
                    </div>
                )}
            </Modal>
            {openDescModal && <TaskDescriptionModal closeFunc={() => { setOpenDescModal(false) }} />}
        </>
    )
}
export default CreateTaskModal;