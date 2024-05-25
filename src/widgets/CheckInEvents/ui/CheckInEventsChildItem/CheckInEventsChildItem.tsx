import { Button } from '@/shared/ui/Button';
import avatarDefault from '@/shared/assets/img/users/default-avatar.png';
import { StarList } from '@/shared/ui/StarList';
import { CustomProgressBar } from '@/shared/ui/CustomProgressBar';
import cl from './checkInEventsChildItem.module.scss';
import { ChildItemType } from '../../types/ChildItemType';
import { getCheckinStatusColor } from '@/entities/checkIn';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import checkinAPIService from '@/entities/checkIn/services/CheckinAPIService';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { useState } from 'react';
import moment from 'moment';

type CheckInEventsChildItemType = {
    checkinData: any,
    userData: any
}

export function CheckInEventsChildItem({checkinData, userData}: CheckInEventsChildItemType) {
    console.log('checkinData', checkinData);
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);

    const {
        id,
        idTask,
        ciStatus,
        createDate,
        updateDate,
        procent,
        progresschange,
        title,
        ciLock
    } = checkinData;
    const { avatar } = userData;

    const [isLock, setIsLock] = useState<boolean>(Boolean(ciLock));
    const [isRead, setIsRead] = useState<boolean>(false);

    const lockCheckin = async () => {
        setIsLock(!isLock);
        try {
            const ciLock = !isLock ? 1 : 0;
            const response = await checkinAPIService.updateCheckIN({id: id, idTask: idTask, login: currentUser.login, ciLock: ciLock });
            if (!response) throw new Error(`Произошла ошибка. Не удалось ${ciLock ? 'закрепить' : 'открепить'} чекин`);
            showInfoAlert({
                format: 'mini', 
                type: 'success', 
                text: `Чекин ${ciLock ? 'закреплен' : 'откреплен'}`
            });
        } catch (error: any) {
            console.error(error);
            showInfoAlert({
                format: 'mini', 
                type: 'error', 
                text: error.message
            });
        }
    }

    const markAsRead = async () => {
        try {
            const response = await checkinAPIService.updateCheckIN({id: id, idTask: idTask, login: currentUser.login, ciSeen: moment().format('YYYY-MM-DD hh:mm:ss') });
            if (!response) throw new Error('Произошла ошибка. Не удалось отметить чекин просмотренным');
            showInfoAlert({
                format: 'mini', 
                type: 'success', 
                text: 'Чекин закреплен'
            });
            setIsRead(true);
        } catch (error: any) {
            console.error(error);
            showInfoAlert({
                format: 'mini', 
                type: 'error', 
                text: error.message
            });
        }
    }

    return (
        !isRead && (
            <div className={cl.itemChild}>
                <div className={cl.childTitleRow}>
                    <div className='d-flex flex-row align-items-center flex-grow-1'>
                        <span className={cl.iconList}>
                            <span className={`${cl.okIcon} ${cl.icon}`} title="Отметить прочитанным" onClick={markAsRead}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90.01 90.01">
                                    <path d="M17.806 68.107c4.2 4.9 9.3 8.9 15.7 10.3 3 .7 6.1 1.1 8.5 3.3 1.9 1.7 2.3 4.2 2.8 6.6.6 3 5.2 1.7 4.6-1.3-.8-3.7-1.7-7-4.8-9.4-4.2-3.3-9.3-3-13.9-5.1-4.8-2.2-9.4-6.7-12-11.2-.8-1.3-3.4-7.4-.1-7.8 1.8-.2 4.4 3.6 5.5 4.7 2.9 2.9 6.3 5.1 10.5 4.1 3.8-.9 7-4.1 7.6-8.1 1.4-9.5-9.3-15-17-10.6-1.9 1.1-4 4.7-6.2 3.9-3.6-1.4-1.2-5.8.6-7.5 5.2-5 12.7-4.1 18.5-.8 2 1.1 4.2-.7 3.7-2.9-1.1-4.9-3.7-9.1-6.5-13.2-1.3-1.8-2.6-3.7-3.8-5.6-.8-1.3-3.9-5.5-.4-4.8 4.5.9 7.9 7.9 10 11.5 2.8 4.7 5.2 9.5 8.6 13.8 1.2 1.5 4 .3 3.8-1.6-.6-5.6-.9-11.2-1.2-16.8-.2-2.8-.4-5.6-.5-8.4-.1-1.2-.2-2.4-.2-3.6-.1-.6-.4-2.6.6-2.5 2.1.1 3.2 12.2 3.6 15.2.6 5.5 1 11.1 1.1 16.6 0 2.2 2.9 2.9 4.1 1.1 2.3-3.6 4.6-7.1 6.9-10.7.9-1.4 2.1-4.3 3.5-5.1 2.5-1.5 2 2.1 1.7 3.4-1.3 6.7-6.7 11.8-9.8 17.6-6.9 12.7-2 27.3.3 40.5.3 2 3.7 1.5 3.5-.5-.7-8.3-2.8-16.3-2.9-24.6 0-5 .9-9.6 3.4-14 2-3.6 4.6-6.8 6.7-10.4 2.4-4.1 6.9-15.6-.8-17.2-3.6-.8-5.9 2.5-7.5 5.1l-5.1 7.8c-.3-5.2-.8-10.4-1.6-15.6-.6-4.4-1-14-7.4-14.3-6.3-.3-4.5 8.6-4.2 12.3.3 5.3.8 10.5 1.1 15.8-2.3-4.1-4.3-8.3-6.9-12.1-3-4.4-7.2-9.8-13.3-8.4-2.3.5-3.7 2-4.1 4.4-.5 2.9 1.3 5.5 2.8 7.9 2.6 4.1 5.7 8 7.8 12.3-3.4-1.1-7-1.4-10.7-.6-5 1.1-10 4.6-11.7 9.6-1.1 3.2-.4 6.8 2 9-1 .8-1.7 2-2.2 3.6-1.3 5.5 2.1 10.6 5.3 14.3zm12-21.2c6.3-1.5 11.5 7.6 4.9 10.7-4.6 2.2-7.8-3.3-11-6.1 2.2-1.6 3.2-3.9 6.1-4.6z"></path>
                                </svg>
                            </span>

                            <span className={`${cl.btnIcon} ${cl.icon} ${isLock ? cl.isLock : ''}`} title={ciLock ? 'Снять закрепление' : 'Закрепить'} onClick={() => lockCheckin()}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    data-name="Layer 1"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M4.854 20.854L9.5 16.207l2.232 2.232A2.5 2.5 0 0016 16.672v-1.965l4.146-4.146a2.912 2.912 0 000-4.122l-1.585-1.585a2.985 2.985 0 00-4.122 0L10.293 9H8.328a2.5 2.5 0 00-1.767 4.268L8.793 15.5l-4.647 4.646a.5.5 0 00.708.708zM8.328 10H10.5a.5.5 0 00.354-.146l4.292-4.293a1.962 1.962 0 012.708 0l1.585 1.585a1.914 1.914 0 010 2.708l-4.293 4.292A.5.5 0 0015 14.5v2.172a1.5 1.5 0 01-2.561 1.06l-5.171-5.171A1.5 1.5 0 018.328 10z"></path>
                                </svg>
                            </span>
                        </span>

                        <img src={avatar || avatarDefault} alt="" className="rounded-circle border border-white border-2 avatar-xs me-2" />

                        <div className={cl.progressContainer}>
                            <CustomProgressBar
                                completed={procent}
                                showLabel={true}
                                subfix='%'
                                maxCompleted={100}
                                status='success'
                            />
                            {progresschange && progresschange !== "0" && (
                                <span className={cl.progressPlus}>
                                    +{progresschange}
                                </span>
                            )}
                        </div>

                        <div className={cl.childTitleContent}>
                            <StarList value={3} status={getCheckinStatusColor(ciStatus)} />
                        </div>
                    </div>

                    <div className={`d-flex align-items-center ${cl.itemDate}`}>
                        <Button color='dark-blue' size='sm' className={`d-none ${cl.checkinBtn} me-3`}>
                            Перейти в Check in
                        </Button>
                        <div>
                            <i className="las la-clock me-1"></i>
                            <span className={cl.date}>
                                {updateDate || createDate}
                            </span>
                        </div>
                    </div>
                </div>

                {title && (
                    <div className={cl.noticeRow}>
                        <div className={cl.noticeTitle}>Заметка</div>
                        <div className={cl.noticeList} dangerouslySetInnerHTML={{__html: title}}></div>
                    </div>
                )}
            </div>
        )
    )
}