import cl from './StrategyMetricItem.module.scss';
import { useEffect, useState, useContext, useId } from 'react';
import Card  from 'react-bootstrap/Card';

import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';
import { Badge, BadgePropsType } from '@/shared/ui/Badge';
import GoalLineSVG from '@/shared/ui/svg/GoalLineSVG/GoalLineSVG';
import ElephantSVG from '@/shared/ui/svg/ElephantSVG/ElephantSVG';
import SnailSVG from '@/shared/ui/svg/SnailSVG/SnailSVG';
import NoticeSVG from '@/shared/ui/svg/NoticeSVG/NoticeSVG';
import { CustomProgressBar } from '@/shared/ui/CustomProgressBar';
import { ArrowBtn } from '@/shared/ui/ArrowBtn';
import { AvatarGroup } from '@/shared/ui/Avatar';
import { useDispatch } from 'react-redux';
import { StarList } from '@/shared/ui/StarList';
import { CreateTaskModal } from '@/features/CreateTaskModal';
import { DeleteTaskAlert } from '@/features/DeleteTaskAlert';
import { StrategicItemType } from '@/features/CreateTaskModal/types/StrategicTypes';
import { StrategyMetricaItemType } from '@/entities/strategyMetrica/types/StrategyMetricaItemType';
import { bgThemeEnum } from '@/shared/ui/Badge/types/badgeProps';

// taskType(pin):"strategy-metrica"
// id(pin):"1"
// title(pin):"Управленческая прибыль Группы за квартал"
// unit(pin):"Проценты"
// indicators(pin):null
// period(pin):"ежеквартально"
// startDate(pin):null
// dueDate(pin):null
// createDate(pin):"01.02.2024"
// updateDate(pin):"02.02.2024"
// createLogin(pin):null
// createFIO(pin):null
// updateLogin(pin):null
// updateFIO(pin):null


type StrategyMetricItemProps = {
    [key:string]: any,
    title: string,
    id: string,
    dueDate: string | null,
    taskType: StrategyMetricaItemType['taskType'];
}

export function StrategyMetricItem(item: StrategyMetricItemProps) {
    
    

    const {
        title,
        id,
        dueDate,
        taskType,
        // titleStrategy = " ",
        // progress = 0,
        // statusCheckin = "В работе",
        // dueDate,
        // complexity
    } = item;

    // const { closeCollapse , changeCloseCollapse} = useContext(CollapseContext);
    const [taskCollapse, setTaskCollapse] = useState(false);
    const [notesCollapse, setNotesCollapse] = useState(false);
    const [childsCollapse, setChildCollapse] = useState(false);
    const [checkInBGTheme, setCheckInBGTheme] = useState<bgThemeEnum>(bgThemeEnum.success);
    const dispatch = useDispatch();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    
    const toggleTaskCollapse = () => {
        setTaskCollapse(!taskCollapse); 
        // changeCloseCollapse(false);
    };

    
    return (
        <>
        
        <div className={`mb-3 text-muted bg-white ${ cl.mainCard}`}>
            <div className='position-relative'>
                <div className='ps-2'>
                    <Card.Header className={`${cl.mainVisibleBlock} position-relative`}> 
                        <div>
                            <div className='fw-semibold fs-18'>
                                {title}
                                <StarList value={0} status={'success'} />
                            </div>
                            <div className='d-flex flex-column'>
                                
                                <div className={`${cl.secondRow} me-3`}>
                                    <div className='d-flex flex-row align-items-center'>
                                        <GoalLineSVG styleProps={{width: '36px', height: '36px', fill: '#0078D4'}}/>
                                        <div className={cl.subTitle}>
                                            Не определена цель группы
                                        </div> 
                                    </div>
                                    <div className='d-flex flex-row align-items-center justify-content-start'>
                                        {/*<AvatarGroup items={JSON.parse(item.responsibles)} />*/}
                                        <div className={`${cl.progressBarContainer} me-5`}></div>
                                    </div>
                                </div>

                                
                                <Stack direction="horizontal" gap={1} className='flex-wrap ps-4'>
                                    <Badge theme={bgThemeEnum.lightBlue} title='Пояснение бейджика'>Стратегическая метрика</Badge>
                                    {dueDate && (
                                        <Badge theme={bgThemeEnum.lightBeige} textWeight='normal' title='Пояснение бейджика'>{dueDate}</Badge>
                                    )}
                                </Stack>
                                
                            </div>
                        </div>
                        
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
                                    <Dropdown.Item
                                    onClick={() => setShowDeleteAlert(true)}
                                    >
                                        Удалить
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <ArrowBtn borderLeft={true} state={taskCollapse} toggleFunc={toggleTaskCollapse}/>
                        </div>    
                    </Card.Header>
                </div>
            </div>
        </div>
        {showEditModal && <CreateTaskModal taskID={id} type={'strategyMetric'}  closeFunc={() => {setShowEditModal(false)}}/>}
        {showDeleteAlert && <DeleteTaskAlert taskType={taskType} id={id} setCloseAlert={() => setShowDeleteAlert(false)}/>}
        </>
    )
}


