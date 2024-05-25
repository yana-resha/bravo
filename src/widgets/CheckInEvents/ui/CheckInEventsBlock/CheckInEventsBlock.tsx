import { Button } from '@/shared/ui/Button';
import cl from './CheckInEventsBlock.module.scss';
import avatarDefault from '@/shared/assets/img/users/default-avatar.png';
import { CheckInEventsList } from '../CheckInEventsList/CheckInEventsList';
import { useDispatch, useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { setCheckinUser } from '@/entities/checkIn/model/slices/checkinSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { scrollToElement } from '@/shared/utils/scrollToElement';
import { MutableRefObject, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
    className?: string,
}

export function CheckInEventsBlock ({className = ''}: Props) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const selectedUser = useSelector((state: StoreReducerType) => state?.checkinData?.selectedUser);

    const closeBlock = () => {
        dispatch(setCheckinUser({ login: null, fio: null, avatar: null }));
    }

    useEffect(() => {
        console.log('init');
        if (document.querySelector('.CheckInEvents')) {
            scrollToElement(document.querySelector('.CheckInEvents'), 0);
        }
    }, []);

    return (
        <AnimatePresence >
        {selectedUser.login && (
            <motion.div
            initial={{opacity: 0, scale: 0}} 
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.5}}
            transition={{type: 'keyframes'}}
            className={`CheckInEvents ${className} ${cl.block}`} 
            >
                <div className={`d-flex flex-row align-items-end justify-content-between mb-2 ${cl.blockHeader}`}>
                    <div className={cl.blockTitle}>События Check in</div>
                    <div className={cl.rightBlock}>
                        <div className={cl.user}>
                            <div className="me-3">
                                <img src={selectedUser.avatar || avatarDefault} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                            </div>
                            <div className={cl.userName}>
                                {selectedUser.fio || 'Неизвестный пользователь'}
                            </div>
                        </div>
                        <Button color='light' onClick={closeBlock} className='pt-0' size='sm' title='Закрыть модальное окно'> 
                            <i className="ri-close-fill fs-24"></i>
                        </Button>
                    </div>
                </div>
                <div className={cl.bodyBlock}>
                    <CheckInEventsList login={selectedUser.login}/>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    )
}
