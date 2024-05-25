/* Hooks */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/* Components */
import { Dropdown } from 'react-bootstrap';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';
import { ArrowBtn } from '@/shared/ui/ArrowBtn';
import { Alert, Spinner } from 'react-bootstrap';

/* Types */
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { StrategyMetricaItemType } from '@/entities/strategyMetrica/types/StrategyMetricaItemType';

/* Styles */
import cl from "./MetricItem.module.scss";

/* Icons */
import { IconKebab } from '@consta/icons/IconKebab';

/* Images */
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { IconCalendar } from '@consta/icons/IconCalendar';
import { Collapse } from '@mui/material';
import { MetricaItemType } from '@/entities/metrica/types/MetricaItemType';
import moment from 'moment';
import metricaApiService from '@/entities/metrica/services/MetricaApiService';
import numberShorter from '@/shared/utils/numberShorter';


type MetricItemProps = {
    item: StrategyMetricaItemType | MetricaItemType;
    className: string;
}

export function MetricItem({ item, className }: MetricItemProps) {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);

    const [showCollapse, setShowCollapse] = useState(false);

    const [isLoading, setLoading] = useState<boolean>(false);
    const [errorLoad, setErrorLoad] =useState<string | false>(false);

    const [childMetricList, setChildMetricList] = useState<MetricaItemType[]>([]);

    const fetchChildMetricList = async () => {
        setLoading(true);

        let childMetrics;
        const request = {
            login: currentUser.login,
            idStrategyMetric: item.id
        }

        try {
            childMetrics = await metricaApiService.readMetricListByStrategyMetric(request);
            setChildMetricList(childMetrics);

            console.log(childMetrics);
            
        } catch (error: any) {
            setErrorLoad(error.message || '');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (showCollapse) {
            fetchChildMetricList();
        }
    }, [showCollapse]);

    const taskType = item.taskType === "strategyMetric" ? 'Стратегическая метрика' : 'Метрика';

    return (
        <div className={`${cl.metricItem} ${className}`}>
            <div className={cl.visiblePart}>
                <div className={cl.header}>
                    <div className={cl.titleBlock}>
                        <div className={cl.taskType}>{taskType}</div>
                        <div className={cl.titleRow}>
                            <span className={cl.title}>{item.title}</span>
                        </div>
                    </div>
                    <div className={`${cl.actionBlock}`}>
                        {item.createLogin === currentUser.login && (
                            <Dropdown align={'start'} className='me-2'>
                                <CustomDropdownToggle>
                                    <button className={`${cl.controlButton} btn btn-light btn-sm rounded-circle d-flex`}>
                                        <IconKebab size="m" />
                                    </button>
                                </CustomDropdownToggle>

                                <Dropdown.Menu className='end-0'>
                                    <Dropdown.Item>Изменить</Dropdown.Item>
                                    <Dropdown.Item>Удалить</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                        {/* {item.taskType === 'strategyMetric' && (
                            <ArrowBtn state={showCollapse} toggleFunc={() => setShowCollapse(!showCollapse)} size='l' />
                        )} */}
                    </div>
                </div>
                <table className={cl.metricStats}>
                    <thead>
                        <tr>
                            <th className={`${cl.hiddenCell}`} scope="col">Прогресс метрики</th>
                            <th className={`${cl.hiddenCell} ${cl.cell}`} scope="col">Плановый показатель</th>
                            <th className={`${cl.cell} ${cl.headerCell}`} scope="col">Факт</th>
                            <th className={`${cl.cell} ${cl.headerCell}`} scope="col">План</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (() => {
                                const dueDatePlan = (item.pf && item.pf[0].month) && '-';
                                const plan = item.pf[0].plan ? item.pf[0].plan : '-';
                                const fact = item.pf[0].fact ? item.pf[0].fact : '-';
                                const percent = (plan !== '-' && fact !== '-') ? plan / fact * 100 : '-';
                                let unit;
                                let date;

                                switch (item.unit) {
                                    case "Рублевая":
                                        unit = '₽';
                                        break;
                                    case "Процентная":
                                        unit = '%';
                                        break;
                                    case "NPS":
                                        unit = 'N';
                                        break;
                                    default:
                                        unit = '';
                                }

                                if (item.pf[0].month) {
                                    const momentDate = moment(item.pf[0].month).locale('ru').format('MMMM YYYY');
                                    date = `${momentDate.charAt(0).toUpperCase() + momentDate.slice(1)}`
                                } else if (item.pf[0].quartal) {
                                    date = `${moment(item.pf[0].month).quarter() + 1}Q ${moment(item.pf[0].month).format('YYYY')}`
                                } else {
                                    date = '-';
                                }

                                return (
                                    <tr>
                                        {/* При изменении кол-во строк относящихся к метрике - менять rowSpan на из общее кол-во */}
                                        <th scope="row" rowSpan={1}>
                                            <div className={cl.metricProgress}>
                                                {
                                                    percent !== '-' && (
                                                        <CircularProgressbarWithChildren
                                                            value={percent} 
                                                            strokeWidth={10}
                                                            styles={
                                                                buildStyles({
                                                                    pathColor: "#44DFC1",
                                                                    trailColor: "#CBD2DD",
                                                                })
                                                            }
                                                        >
                                                            <span className="progressbarText">{`${percent}%`}</span>
                                                        </CircularProgressbarWithChildren>
                                                    )

                                                }
                                                
                                            </div>
                                        </th>

                                        <td className={`${cl.cell}`}>{date}</td>
                                        <td className={`${cl.cell}`}>{fact !== '-' ? numberShorter(fact) : fact} {fact !== '-' ? unit : ''}</td>
                                        <td className={`${cl.cell}`}>{plan !== '-' ? numberShorter(plan) : plan} {plan !== '-' ? unit : ''}</td>
                                    </tr>
                                )
                            })()
                        }

                        {/* Для последующих строк относящихся к метрике
                        <tr>
                            <td className={`${cl.cell}`}>4Q 2026</td>
                            <td className={`${cl.cell}`}></td>
                            <td className={`${cl.cell}`}>25 млрд.₽</td>
                        </tr> */}
                    </tbody>
                </table>
                <div className={cl.metricInfo}>
                    <div className={cl.metricPeriod}>
                        {item.startDate && item.dueDate &&
                            <>
                                <IconCalendar className={cl.periodIcon} />
                                <div>
                                    {item.startDate && `с ${moment(item.startDate).format('DD.MM.YYYY')} `}
                                    {item.dueDate && `по ${moment(item.dueDate).format('DD.MM.YYYY')}`}
                                    {item.startDate && item.dueDate &&
                                        <div className={cl.metricRemainsPeriod}>
                                            {'осталось '}
                                            {
                                                moment
                                                    .duration(moment(item.startDate).diff(moment(item.dueDate)))
                                                    .locale('ru')
                                                    .humanize()
                                            }
                                        </div>
                                    }
                                </div>
                            </>
                        }
                    </div>

                    <div className={cl.metricUpdate}>
                        <div className={cl.updateDate}>
                            <i className={`${cl.updateDateIcon} ri-refresh-line`} />
                            {moment(item.updateDate).format('DD.MM.YYYY')} ({item.period})
                        </div>
                        <div className={cl.metricFD}>ФД - Карпунин А.</div>
                    </div>
                </div>
            </div>

            <Collapse in={showCollapse}>
                <div className={cl.subMetrics}>
                    {isLoading && (
                        <div className='d-flex flex-column align-items-center justify-content-center p-3'>
                            <Spinner animation="border" variant="primary" />
                            <div className='fw-bold fs-12 mt-1'>Загружаем список метрик...</div>
                        </div>
                    )}

                    {errorLoad && (
                        <Alert 
                            className='d-flex justify-content-center mb-0'
                            variant='danger'
                        >
                            {errorLoad}
                        </Alert>
                    )}

                    {!errorLoad && (!childMetricList.length) && (
                        <Alert 
                            className='d-flex justify-content-center mb-0'
                            variant='primary'
                        >
                            Список пуст
                        </Alert>
                    )}
                    {Boolean(childMetricList.length) && childMetricList.map((metric: MetricaItemType) => {
                        return <MetricItem className={'FullStrategyTarget__metricItem'} item={metric} />
                    })}
                </div>
            </Collapse>
        </div>
    )
}