/* Hooks */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

/* Services */
import taskService from "@/entities/task/services/TaskService";

/* Components */
import { Alert, Collapse, Spinner } from "react-bootstrap";
import TaskItem from "../../TaskItem";
import MetricItem from "../../MetricItem";

/* Styles */
import './FullStrategyTarget.scss';

/* Types */
import { FullStrategyTargetType } from '../types/FullStrategyTargetType';
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import strategyMetricaServiceAPI from "@/entities/strategyMetrica/services/StrategyMetricaApIService";
import { StrategyMetricaItemType } from "@/entities/strategyMetrica/types/StrategyMetricaItemType";


export const FullStrategyTarget = ({StTargetID, StTargetItem, isVisible = true}: FullStrategyTargetType) => {
    const [showTaskCollapse, setShowTaskCollapse] = useState(false);

    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    
    const [stTargetID, setStTargetID] = useState<string | number>(StTargetID);

    const [listTasks, setListTasks] = useState<any>([]);
    const [isLoadingTasks, setLoadingTasks] = useState<boolean>(false);
    const [errorLoadTasks, setErrorLoadTasks] =useState<string | false>(false);

    const [listMetrics, setListMetrics] = useState<any>([]);
    const [isLoadingMetrics, setLoadingMetrics] = useState<boolean>(false);
    const [errorLoadMetrics, setErrorLoadMetrics] =useState<string | false>(false);

    

    useEffect(() => {
        if (showTaskCollapse) {
            try {
                setLoadingTasks(true);
                getListTasks();
            } catch (error) {
                setErrorLoadTasks('Ошибка при получении списка задач');
            } finally {
                setLoadingTasks(false);
            }
            
            try {
                setLoadingMetrics(true);
                getListMetrics();
            } catch (error) {
                setErrorLoadMetrics('Ошибка при получении списка метрик');
            } finally {
                setLoadingMetrics(false);
            }
        }
    }, [showTaskCollapse]);


    const getListTasks = async () => {
        const request = {
            login: currentUser.login,
            idStrategy: stTargetID
        };
        const listTasks = await taskService.getListByStrategy(request);
        setListTasks(listTasks);
    }

    const getListMetrics = async () => {
        const request = {
            login: currentUser.login,
            idStrategy: stTargetID
        };
        const listMetrics = await strategyMetricaServiceAPI.readStrategyMetricListByStrategy(request);
        setListMetrics(listMetrics);
    }
    
    return (
        <div className={`FullStrategyTarget ${isVisible ? "" : "d-none"}`}>
            <div className="">
                <div className="FullStrategyTarget__top">
                    {StTargetItem}

                    <div className="FullStrategyTarget__collapse" onClick={() => setShowTaskCollapse(!showTaskCollapse)}>
                        {showTaskCollapse ? 'Скрыть OKR и метрики' : 'Показать OKR и метрики'}
                    </div>
                </div>
            </div>

            <Collapse in={showTaskCollapse}>
                <div className="FullStrategyTarget__collapseContainer">
                    <div className="FullStrategyTarget__listContainer">
                        {isLoadingTasks && (
                            <div className='d-flex flex-column align-items-center justify-content-center p-3'>
                                <Spinner animation="border" variant="primary" />
                                <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                            </div>
                        )}

                        {errorLoadTasks && (
                            <Alert 
                                className='d-flex justify-content-center'
                                variant={'danger'}
                            >
                                {errorLoadTasks}
                            </Alert>
                        )}

                        {!listTasks || !listTasks.length && (
                            <Alert 
                                className='d-flex justify-content-center'
                                variant={'primary'}
                            >
                                Задачи отсутствуют
                            </Alert>
                        )}                        

                        {listTasks && listTasks.map((task: OKRItemType) => {
                            return <TaskItem { ...task }/>
                        })}
                    </div>

                    <div className="FullStrategyTarget__listContainer">
                        {isLoadingMetrics && (
                            <div className='d-flex flex-column align-items-center justify-content-center p-3'>
                                <Spinner animation="border" variant="primary" />
                                <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                            </div>
                        )}

                        {errorLoadMetrics && (
                            <Alert 
                                className='d-flex justify-content-center'
                                variant={'danger'}
                            >
                                {errorLoadTasks}
                            </Alert>
                        )}

                        {!listMetrics || !listMetrics.length && (
                            <Alert 
                                className='d-flex justify-content-center'
                                variant={'primary'}
                            >
                                Метрики отсутствуют
                            </Alert>
                        )}                        

                        {listMetrics && listMetrics.map((metric: StrategyMetricaItemType) => {
                            return <MetricItem className={'FullStrategyTarget__metricItem'} item={metric} />
                        })}
                    </div>
                </div>
            </Collapse>
        </div>
    )
}
