import { Button } from '@/shared/ui/Button';
import cl from './CheckInEventsList.module.scss';
import { useEffect, useState } from 'react';
import { CheckInEventsItem } from '../CheckInEventsItem/CheckInEventsItem';
import taskService from '@/entities/task/services/TaskService';
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { Alert, Spinner } from 'react-bootstrap';
import { AnimationPage } from '@/shared/ui/AnimationPage';
import { scrollToElement } from '@/shared/utils/scrollToElement';
import { AnimationListItem } from '@/shared/ui/AnimationListItem';
import { AnimatePresence, motion } from 'framer-motion';

type CheckInEventsListPropsType = {
    login: string | null
}

export function CheckInEventsList ({ login }: CheckInEventsListPropsType) {
    const [stepTask, setStepTask] = useState<number>(2);
    const [maxLength, setMaxLength] = useState<number>(2);

    const [tasksList, setTasksList] = useState<OKRItemType[] | []>([]);
    const [visibleTasksList, setVisibleTasksList] = useState<OKRItemType[] | []>([]);
    const [loadTasksList, setLoadTasksList] = useState<boolean>(true);
    const [isLoadedTasks, setIsLoadedTasks] = useState<boolean>(false);
    const [errorLoadTasksList, setErrorLoadTasksList] = useState<string | null>(null);
    const getTasksList = async () => {
        const response = await taskService.getListInProgress({ login, shortList: true });
        setTasksList(response);
        setIsLoadedTasks(true);
    } 

    const showMoreTasks = () => setMaxLength(maxLength + stepTask);

    useEffect(() => {
        setIsLoadedTasks(false);
        try {
            getTasksList(); 
        } catch (error: any) {
            setErrorLoadTasksList(error.message);
        } finally {
            setLoadTasksList(false);
        }
    }, [login]);

    useEffect(() => {
        const showTasks = tasksList.filter((task, index) => index <= maxLength);
        setVisibleTasksList(showTasks);
        
    }, [tasksList, maxLength]);

    useEffect(() => {
        if (isLoadedTasks) {
            setTimeout(() => {
                scrollToElement(document.querySelector('.CheckInEvents'), 65);
            }, 200);
        }
    }, [isLoadedTasks]);

    return (
        <AnimatePresence mode='wait'>
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <div className={cl.list}>
                
                    {loadTasksList && (
                        <motion.div 
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0}}
                        transition={{type: 'spring', duration: 1}}
                        className='d-flex flex-column align-items-center justify-content-center p-3'
                        >
                            <Spinner animation="border" variant="primary" />
                            <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                        </motion.div>
                    )}

                    {errorLoadTasksList && (
                        <motion.div
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0}}
                        transition={{type: 'spring', duration: 1}}
                        >
                            <Alert 
                                className='d-flex justify-content-center'
                                variant={'danger'}>
                                {errorLoadTasksList}
                            </Alert>
                        </motion.div>
                        
                    )}

                    {tasksList.length === 0 && (
                        <motion.div
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0}}
                        transition={{type: 'spring', duration: 1}}
                        >
                            <Alert 
                                className='d-flex justify-content-center'
                                variant={'primary'}>
                                Задачи отстуствуют
                            </Alert>

                        </motion.div>
                        
                    )}

                    {visibleTasksList.map((el, index) => {
                        return (
                            <AnimationListItem key={el.id} index={index}><CheckInEventsItem key={el.id} {...el}/></AnimationListItem>
                        )
                    })}
                
            </div>

            {visibleTasksList.length < tasksList.length && (
                <Button className={cl.loadBtn} color='outline-light' onClick={showMoreTasks}>
                    Загрузить еще ({stepTask})
                </Button>
            )}
        </div>
        </AnimatePresence>
    )
}