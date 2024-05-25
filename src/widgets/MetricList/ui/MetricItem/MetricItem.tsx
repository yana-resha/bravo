import cl from './MetricItem.module.scss';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState, useEffect } from 'react';
import Card  from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';
import { Badge } from '@/shared/ui/Badge';
import GoalLineSVG from '@/shared/ui/svg/GoalLineSVG/GoalLineSVG';
import NoticeSVG from '@/shared/ui/svg/NoticeSVG/NoticeSVG';
import { ArrowBtn } from '@/shared/ui/ArrowBtn';

import { CreateTaskModal } from '@/features/CreateTaskModal';
import { DeleteTaskAlert } from '@/features/DeleteTaskAlert';
import { Collapse } from 'react-bootstrap';
import { DinamicMetric } from './DinamicMetric/DinamicMetric';
import { StatsResponsible } from './StatsResponsible/StatsResponsible';
import { Notes } from './Notes/Notes';
import { MetricValuesType } from '@/features/CreateTaskModal/types/MetricValues';
import moment from 'moment';
import { CheckINModal } from '@/features/CheckINModal';
import { bgThemeEnum } from '@/shared/ui/Badge/types/badgeProps';
import { ResponsibleType } from '@/shared/types/responsibleType';

type MetricItemProps = {
    [key:string]: any,
    title: string,
    id: string,
    dueDate: string | null,
    taskType: 'strategyMetric' | 'metric';
    metricValues: MetricValuesType[] | null,
    period: string,
    updateDate: string,
    responsibles?: ResponsibleType[],
    indicators?: any,
    isVisible?: boolean,
    changeCloseCollapse?: (value: boolean) => void,
    closeCollapse?: boolean,
}

export function MetricItem(item: MetricItemProps) {
    
    const {
        changeCloseCollapse = () => {},
        title,
        id,
        dueDate,
        taskType,
        metricValues,
        period,
        updateDate,
        responsibles,
        indicators,
        isVisible = true,
        closeCollapse = false,
    } = item;

    const [taskCollapse, setTaskCollapse] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const taskTypeText = taskType === 'metric'
        ? 'Метрическая задача'
        : 'Стратегическая метрика';

    const currentMetricValue = metricValues?.find((metric) => {
        return moment().isSame(metric.month, 'month');
    });
    
    const toggleTaskCollapse = () => {
        setTaskCollapse(!taskCollapse); 
        changeCloseCollapse(false);
    };

    useEffect(() => {

        if (closeCollapse === true) {
            setTaskCollapse(false);
            
        }

    }, [closeCollapse])

    return (
        <>
            <div className={`mb-3 text-muted bg-white ${cl.mainCard} ${isVisible ? "" : "d-none"}`} >
                <div className='position-relative'>
                    <div className='ps-2'>
                        <Card.Header className={`${cl.mainVisibleBlock} position-relative`}>
                            {/* левый блок */}
                            <div>
                                <div className='fw-semibold fs-18'>{title}</div>
                                <div className='d-flex flex-column'>
                                    <div className='d-flex flex-row align-items-center justify-content-between me-3'>
                                        {indicators.length > 0 && (
                                            <div className='mb-3'>
                                                {indicators.map((indicator: any) => {
                                                    return (
                                                        <div className='d-flex flex-row align-items-center'>
                                                            <GoalLineSVG styleProps={{width: '30px', height: '30px', fill: '#0078D4'}} />
                                                            <div className={cl.subTitle}>
                                                                {indicator.title}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                        <div className='d-flex flex-row align-items-center'></div>
                                        <div className={`${cl.statsResponsible}`}>
                                            <StatsResponsible responsibles={responsibles} metricValue={currentMetricValue} />
                                        </div>
                                    </div>

                                    <Stack direction="horizontal" gap={1} className='flex-wrap'>
                                        <Badge theme={bgThemeEnum.danger} title='Тип задачи'>{taskTypeText}</Badge>
                                        {dueDate && <Badge theme={bgThemeEnum.lightBeige} textWeight='normal' title='Крайняя дата'>{dueDate}</Badge>}
                                    </Stack>
                                </div>
                            </div>
                        
                            {/* Правый блок */}
                            <div className='d-flex flex-row align-items-center justify-content-end'>
                                <div className={`d-flex flex-row me-3 align-items-start`}>
                                    
                                    <span title='Есть уведомления'>
                                        <NoticeSVG styleProps={{width: '32px', height: '32px'}}/> 
                                    </span>
                                </div>
                                <Dropdown align={'start'} className='me-3'>
                                    <CustomDropdownToggle>
                                        <button className='btn btn-light btn-sm rounded-circle'>
                                            <i className="ri-more-fill"></i>
                                        </button>
                                    </CustomDropdownToggle>
                                                        
                                    <Dropdown.Menu className='end-0'>
                                        <Dropdown.Item onClick={() => {setShowEditModal(true)}}>
                                            Редактировать
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => setShowDeleteAlert(true)}>
                                            Удалить
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <ArrowBtn borderLeft={true} state={taskCollapse} toggleFunc={toggleTaskCollapse}/>
                            </div>
                        </Card.Header>
                    </div>
                    <Collapse in={taskCollapse}>
                        <Card.Body>
                            <div className={`${cl.infoList}`}>
                                <Notes 
                                closeCollapse={closeCollapse}/>
                                <DinamicMetric 
                                closeCollapse={closeCollapse}
                                period={period} 
                                values={metricValues} 
                                latestUpdate={updateDate} 
                                />
                            </div>
                        </Card.Body>
                    </Collapse>
                </div>
            </div>
            {showEditModal && <CreateTaskModal taskID={id} type={taskType}  closeFunc={() => {setShowEditModal(false)}}/>}
            {showDeleteAlert && <DeleteTaskAlert taskType={taskType} id={id} setCloseAlert={() => setShowDeleteAlert(false)}/>}
        </>
    )
}