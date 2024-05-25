import {Form, Modal, Spinner} from 'react-bootstrap';
import cl from './CreateTargetModal.module.scss';
import './CreateTargetModal.scss';
import { Button } from '@/shared/ui/Button';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useResponsible } from '../libs/hooks/useResponsible';
import { useTaskName } from '../libs/hooks/useTaskName';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useDispatch } from 'react-redux';
import { ResponsibleField } from './ResponsiblesField/ResponsibleField';
import strategyApiService from '@/entities/StrategyTarget/services/StrategyApiService';
import { addStrategyTarget, updateStrategyTarget} from '@/entities/StrategyTarget/model/slices/strategyTargetSlice';
import { ModalPropsType } from '../types/ModalPropsType';
import { useEditData } from '../libs/hooks/useEditData';
import { ResponsibleType } from '@/shared/types/responsibleType';
import { Field } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';



export function CreateTargetModal({closeFunc, typeModal = 'create', taskID} : ModalPropsType) {

    const [modalType, setModalType] = useState<ModalPropsType['typeModal']>(typeModal);
    const {editData, editDataLoading, editDataError} = useEditData({modalType, taskID})
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const dispatch = useDispatch();
    const taskType = {
        label: 'Стратегическая цель',
        id: 'Стратегическая цель'
    }
    const [formInLoad, setFormInLoad] = useState(false);
    const {nameValue, handlerChangeName, nameInvalid} = useTaskName('');
    const {responsibleList, respInvalid,respListInLoad, responsibleValues, changeResponsibleValues} = useResponsible(taskType);
    const [verityValid, setVerityValid] = useState<boolean>(false);
    const modalTitle = modalType == 'create' ? 'Новая стратегическая цель' : 'Изменить стратегическую цель';
    const [fieldsSelectResp, SetFieldsSelectResp] = useState<any[]>([]);

    useEffect(() => {
        if (editData) {
            handlerChangeName(editData.title);
            editData.responsibles?.forEach((resp, index) => {
                if (index > 0) {
                    addFieldSelectResp(resp);
                }
            })
        }
    }, [editData]);

    const addFieldSelectResp = (initialValue? : ResponsibleType) => {
        let newField : any = {[Math.floor(Math.random() * 1000) + 1] : true}
        if (initialValue) newField.initialValue = initialValue;
        SetFieldsSelectResp(prev => {
            return [...prev, newField]
        });
    }
    const removeFieldSelectResp = (index: number | string ) => {
        let currentArr = fieldsSelectResp;
        currentArr = currentArr.map(el => {
            if (el[index]) {
                el[index] = false;
            }

            return el;
        })
        SetFieldsSelectResp(currentArr);
    }
    const handlerSubmit = () => {
        
        setVerityValid(true);
        const request = setRequestForm();
        if (request) {
            if (modalType == 'create') {
                createNewStrategyTarget(request);
            } else if (modalType == 'edit') {
                request.id = taskID;
                updateIStrategy(request);
            }
            
        } else {
            showInfoAlert({
                format : 'full', 
                text: 'Пожалуйста, заполните все обязательные поля', 
                type: 'error'
            });
        }
    }
    const setRequestForm = () => {
        let request : any   = {
            login: currentUser.login,
            title: nameValue,
            responsibles: responsibleValues,
        }
        if (nameInvalid) return false;
        if (respInvalid) return false;

        return request;
    }
    const createNewStrategyTarget = async (request : any ) => {
        setFormInLoad(true);
        try {
            let response = await strategyApiService.createIStrategy(request);
            if (response) {
                dispatch(addStrategyTarget(response));
                closeFunc();
                showInfoAlert({
                    format : 'mini', 
                    text: "Стратегическая цель успешно создана!", 
                    type: 'success',
                });
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

    const updateIStrategy = async (request : any ) => {
        setFormInLoad(true);

        try {
            let response = await strategyApiService.updateIStrategy(request);
            if (response) {
                dispatch(updateStrategyTarget(response));
                closeFunc();
                showInfoAlert({
                    format : 'mini', 
                    text: "Стратегическая цель успешно изменена!", 
                    type: 'success',
                });
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

    return (
        <>
            <Modal
                className="targetModal"
                show={true}
                onHide={closeFunc}
                centered
                dialogClassName={cl.modalDialog}
                contentClassName={cl.contentModal}
                scrollable={true}
                backdrop="static"
            >
                <div className='d-flex flex-row justify-content-between mb-3' style={{zIndex: 1}}>
                    <div className={cl.modalTitle}>{modalTitle}</div>
                    <Button 
                        color='light' 
                        onClick={closeFunc} 
                        className='pt-0' 
                        size='sm' 
                        title='Закрыть модальное окно'
                    > 
                        <i className="ri-close-fill fs-24"></i>
                    </Button>
                </div>

                <Modal.Body>
                    <Field
                        label={<>Наименование задачи<span className={cl.labelStar}>*</span></>}
                        className={`mb-3`}
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
                    <div className={`mb-3`}>
                        <Field
                            label={<>Назначьте ответственного<span className={cl.labelStar}>*</span></>}
                            error={respInvalid && verityValid ? respInvalid : false}
                        >
                            <ResponsibleField
                                changeFunc={changeResponsibleValues}
                                responsibleList={responsibleList}
                                index={'-1'}
                                key={'-1'}
                                initialValue={modalType == 'edit' && editData && editData.responsibles ? editData.responsibles[0] : null}
                                className={`${respListInLoad ? 'load' : ''} ${respInvalid && verityValid ? 'invalid' : ''}`}
                            />
                        </Field>
                        <div>
                            {fieldsSelectResp.map((el) => {
                                let show = Object.values(el)[0];
                                let key = Object.keys(el)[0];
                                if (show) {
                                    return (
                                        <ResponsibleField
                                            closeBtn={true}
                                            key={key}
                                            closeFunc={removeFieldSelectResp}
                                            changeFunc={changeResponsibleValues}
                                            responsibleList={responsibleList}
                                            index={key}
                                            initialValue={el['initialValue'] ?? null}
                                        />
                                    )
                                } else {
                                    return <></>
                                }
                            })}
                        </div>
                        <div className="d-flex justify-content-end">
                            <Button
                                className={cl.addBtn}
                                color='clear'
                                onClick={() => addFieldSelectResp()}
                            >
                                <i className="bx bx-plus me-1" ></i>
                                Добавить ответственного
                            </Button>
                        </div>
                    </div>
                </Modal.Body>

                <div className={`d-flex flex-row justify-content-between mb-2 mt-2`}>
                    <div></div>
                    <div>
                        <Button
                            borderRadius='pill'
                            size='lg'
                            color='primary'
                            className='me-2'
                            onClick={() => handlerSubmit()}
                            disabled={formInLoad}
                        >
                            {modalType == 'create' ? 'Создать' : 'Изменить'}
                        </Button>
                    </div>
                </div>

                {editDataLoading && (
                    <div className={cl.modalLoader}>
                        <Spinner animation="border" variant="primary" />
                        <div className='mt-1'>Загружаем данные по задаче...</div>
                    </div>
                )}

                {editDataError && (
                    <div className={cl.modalLoaderError}>
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 504 504" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon style={{fill:'#DF5C4E'}} points="152.4,500 10,353.6 10,148.8 152.4,4 357.2,4 502,148.8 502,353.6 357.2,500 "></polygon> <g> <path style={{fill:"#F4EFEF"}} d="M254,325.6c-10.8,0-20-8.8-20-19.6V133.2c0-10.8,9.2-19.6,20-19.6s20,8.8,20,19.6V306 C274,316.8,264.8,325.6,254,325.6z"></path> <path style={{fill:"#F4EFEF"}} d="M254,388.4c-5.2,0-10.4-2-14-5.6s-5.6-8.8-5.6-14s2-10.4,5.6-14s8.8-5.6,14-5.6s10.4,2,14,5.6 s5.6,8.8,5.6,14s-2,10.4-5.6,14S259.2,388.4,254,388.4z"></path> </g> <path d="M250,329.6c-13.2,0-24-10.8-24-23.6V133.2c0-13.2,10.8-23.6,24-23.6s24,10.8,24,23.6V306C274,319.2,263.2,329.6,250,329.6z M250,117.6c-8.8,0-16,7.2-16,15.6V306c0,8.4,7.2,15.6,16,15.6s16-7.2,16-15.6V133.2C266,124.8,258.8,117.6,250,117.6z"></path> <path d="M250,392.4c-6.4,0-12.4-2.4-16.8-6.8c-4.4-4.4-6.8-10.4-6.8-16.8s2.4-12.4,6.8-16.8c4.4-4.4,10.4-6.8,16.8-6.8 c6,0,12.4,2.4,16.8,6.8c4.4,4.4,6.8,10.4,6.8,16.8s-2.4,12.4-6.8,16.8S256.4,392.4,250,392.4z M250,353.2c-4,0-8,1.6-11.2,4.8 c-2.8,2.8-4.4,6.8-4.4,11.2c0,4,1.6,8,4.4,11.2c2.8,2.8,6.8,4.4,11.2,4.4c4,0,8-1.6,11.2-4.4c2.8-2.8,4.4-6.8,4.4-11.2 c0-4-1.6-8-4.4-11.2C258,354.8,254,353.2,250,353.2z"></path> <path d="M357.2,504H152.4c-1.2,0-2-0.4-2.8-1.2L3.2,356.4c-0.8-0.8-1.2-1.6-1.2-2.8V148.8c0-1.2,0.4-2,1.2-2.8L149.6,1.2 c0.8-0.8,1.6-1.2,2.8-1.2h204.8c1.2,0,2,0.4,2.8,1.2L500.8,146c0.8,0.8,1.2,1.6,1.2,2.8v204.8c0,1.2-0.4,2-1.2,2.8L360,502.8 C359.2,503.6,358.4,504,357.2,504z M154,496h201.6L494,352V150.4L355.6,8H154L10,150.4V352L154,496z"></path> </g></svg>
                        <div className='mt-1'>Произошла ошибка: {editDataError}</div>
                        <div className='fs-11'>Попробуйте перезагрузить страницу</div>
                    </div>
                )}
            </Modal>
        </>
    )
}

