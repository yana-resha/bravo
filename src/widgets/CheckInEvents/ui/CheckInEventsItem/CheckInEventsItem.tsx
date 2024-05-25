import cl from './CheckInEventsItem.module.scss';
import { ChildItemType } from '../../types/ChildItemType';
import { CheckInEventsChildItem } from '../CheckInEventsChildItem/CheckInEventsChildItem';
import { useEffect, useId, useState } from 'react';
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import checkinAPIService from '@/entities/checkIn/services/CheckinAPIService';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { Alert, Spinner } from 'react-bootstrap';
import { CheckinItemType } from '@/entities/checkIn/types/CheckinType';

const childsList : ChildItemType [] = [
    {
        title: 'Создание IT инфраструкутры',
        notice: []
    },
    {
        title: 'Вопросник для ТКБ Пей и Корпа через Inside',
        
    }
]

export function CheckInEventsItem (task: OKRItemType) {
    const selectedUser = useSelector((state: StoreReducerType) => state?.checkinData?.selectedUser);
    const {id, title} = task;

    const [checkinList, setCheckinList] = useState<any | []>([]);
    const [filteredChecklist, setFilteredChecklist] = useState<any | []>([]);
    const [loadChecklist, setLoadChecklist] = useState<boolean>(true);
    const [errorLoadChecklist, setErrorLoadChecklist] = useState<string | null>(null);
    const getChecklist = async () => {
        const response = await checkinAPIService.readCheckIN({login: selectedUser.login, idTask: id});
        setCheckinList(response);
    }

    useEffect(() => {
        try {
            getChecklist();
        } catch (error: any) {
            setErrorLoadChecklist(error.message);
        } finally {
            setLoadChecklist(false);
        }
    }, []);

    useEffect(() => {
        
        const filteredList = checkinList.filter((checkin: any) => checkin.ciLock !== null || !checkin.ciSeen);
        setFilteredChecklist(filteredList);
    }, [checkinList]);

    return (
        <div className={cl.item}>
            <div className={cl.itemCircle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <circle cx="15" cy="15" r="14" stroke="#3754DB" strokeWidth="2"/>
                    <circle cx="15" cy="15" r="10" fill="#6684FF"/>
                </svg>
            </div>

            <div>
                <div className={cl.titleRow}>
                    <div className={cl.itemTitle}>{title}</div>
                </div>

                {loadChecklist && (
                    <div className='d-flex flex-column align-items-center justify-content-center p-3'>
                        <Spinner animation="border" variant="primary" />
                        <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                    </div>
                )}

                {errorLoadChecklist && (
                    <Alert 
                        className='d-flex justify-content-center'
                        variant={'danger'}>
                        {errorLoadChecklist}
                    </Alert>
                )}

                {filteredChecklist.length === 0 && (
                    <Alert 
                        className='d-flex justify-content-center'
                        variant={'primary'}>
                        Список чекинов пуст
                    </Alert>
                )}

                {filteredChecklist.map((checkin: CheckinItemType) => <CheckInEventsChildItem checkinData={checkin} userData={selectedUser}/>)}
            </div>
        </div>
    )
}