import { Dropdown } from 'react-bootstrap';
import cl from './MetrikaItem.module.scss';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';
import { IconKebab } from '@consta/icons/IconKebab';
import { ArrowBtn } from '@/shared/ui/ArrowBtn';
import { useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

export function MetrikaItem() {

    const [showCollapse, setShowCollapse] = useState(false);
    
    return (
        <div className={`${cl.block}`}>
            <div className={cl.body}>
                <div className='w-100'>
                    <div className={cl.taskType}>Стратегическая метрика</div>
                    <div className={cl.title}>Кредитная прибыль Группы</div>

                    <div className={cl.valueBlock}>

                        <div className={cl.progress}>
                            <div className={cl.progressContainer}>
                                <CircularProgressbarWithChildren
                                    value={20}
                                    strokeWidth={10}
                                    styles={
                                        buildStyles({
                                            pathColor: "#78A55A",
                                            trailColor: "#CBD2DD",
                                        })
                                    }
                                >
                                    <span className={cl.progressValue}>20%</span>
                                </CircularProgressbarWithChildren>
                            </div>
                            <div className={cl.progressPeriods}>
                                <div className={cl.periodsValue}>4Q 2023 </div>
                                <div className={cl.periodsValue}>4Q 2026 </div>
                            </div>
                        </div>
                        <div className={cl.valueList}>
                            <div className={cl.listTitleRow}>
                                <div className='text-center'>Факт</div>
                                <div className='text-center'>План</div>
                            </div>
                            <div className={cl.listValueRow}>
                                <div>5.2 млрд.₽</div>
                                <div>5.1 млрд.₽</div>
                            </div>

                            <div className={cl.listValueRow}>
                                <div></div>
                                <div>25 млрд.₽</div>
                            </div>
                        </div>

                    </div>

                    
                </div>
                
                <div className={cl.actionBlock}>
                <Dropdown align={'start'} className='me-2'>
                    <CustomDropdownToggle>
                        <button className='btn btn-light btn-sm rounded-circle d-flex'>
                            <IconKebab size="m" />
                        </button>
                    </CustomDropdownToggle>
                                        
                    <Dropdown.Menu className='end-0'>
                        <Dropdown.Item>Изменить</Dropdown.Item>
                        <Dropdown.Item>Удалить</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <ArrowBtn state={showCollapse} toggleFunc={() => setShowCollapse(!showCollapse)} size='l'/>
                </div>
            </div>
            <div className={cl.footer}>
                <div className={cl.dateBlock}>
                    <i className={`ri-calendar-todo-fill ${cl.dateIcon} me-1`}></i>
                    <div>
                        <div className={cl.dateText}>с 31.12.2021 по 31.12.2026</div>
                        <div className={cl.subText}>осталось 3 года</div>
                    </div>
                </div>
                <div>
                    <div className={cl.footerRow}>
                        <i className={`mdi mdi-update me-2 ${cl.updateIcon}`}></i>
                        10.11.2023 (ежемесячно)
                    </div>

                    <div className={cl.footerRow}>
                        <i className={`mdi mdi-account-check-outline me-2 ${cl.fdIcon}`}></i>
                        ФД - Карпунин А. 
                    </div>
                </div>
            </div>
        </div>
    )
}