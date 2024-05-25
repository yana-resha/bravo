/* Hooks */
import { useState } from 'react';

/* Features */
import RemovePriorityTaskAlert from '@/features/RemovePriorityTask';

/* Components */
import { Button } from '@/shared/ui/Button';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';
import { CustomProgressBar } from '@/shared/ui/CustomProgressBar';
import { Badge } from '@/shared/ui/Badge';
import { StarList } from '@/shared/ui/StarList';

/* Types */
import { taskItemProps } from '../types/taskItem';

/* Styles */
import cl from './priorityTaskItem.module.scss';

/* Image & Icons */
import GoalLineSVG from '@/shared/ui/svg/GoalLineSVG/GoalLineSVG';
import defaultAvatar from '../../../../../shared/assets/img/users/default-avatar.png';

/* Utils */
import { getCheckinStatusColor } from '@/entities/checkIn';
import { bgThemeEnum } from '@/shared/ui/Badge/types/badgeProps';


export function PriorityTaskItem ({task} : taskItemProps) {
    const {
        id, 
        level, 
        taskName,
        title, 
        description, 
        responsibles, 
        complexity, 
        createDate, 
        progress, 
        strategy, 
        statusCheckin
    } = task;

    const [showRemoveAlert, setShowRemoveAlert] = useState<boolean>(false);

    return (
        <>
            {showRemoveAlert && <RemovePriorityTaskAlert taskID={id} setCloseAlert={() => setShowRemoveAlert(false)}/>}
            <div className={cl.item}>
                <div className={cl.itemBorder} data-level={1}></div>
                <div className={cl.contentContainer}>
                    <div className={cl.mainContentContainer}>
                        <div className={cl.statusIconContainer}>
                            <i className="mdi mdi-check-circle-outline"></i>
                        </div>
                        <div className={cl.content}>
                            <div>
                                <div className={cl.title}>{title}</div>
                                <div className={cl.middleGridRow}>
                                    <div className={cl.description}>
                                        <span className={cl.descText}>
                                            {description ? description : 'Без привязки к OKR'}
                                        </span>
                                        <span className={cl.starList}>
                                            <StarList value={complexity} status={'success'} />
                                        </span>
                                    </div>
                                    <div className='d-flex flex-row justify-content-between'>
                                        <div className={`${cl.progressBarContainer} me-5`}>
                                            <CustomProgressBar
                                                completed={progress}
                                                showLabel={true}
                                                subfix='%'
                                                maxCompleted={100}
                                                status='success'
                                                height='17px'
                                            />
                                        </div>
                                        {statusCheckin && (
                                            <Badge 
                                                borderRadius='pill' 
                                                textWeight='normal' 
                                                theme={getCheckinStatusColor(statusCheckin)} 
                                                className='fs-16'
                                            >
                                                Под угрозой
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="avatar-group avatar-group-responsible flex-nowrap">
                                    {responsibles.map((name: any, index: number) => (
                                        <TooltipWhite key={index} position='top' content={name.fio}>
                                            <div className="avatar-group-item">
                                                <img src={`${name.avatar ?? defaultAvatar}`} alt="" className="rounded-circle border border-white border-2 avatar-xs" />
                                            </div>
                                        </TooltipWhite>
                                    ))}
                                    {responsibles.length > 3 && (
                                        <div className="avatar-group-item avatar-xs border border-white border-2 rounded-circle">
                                            +{responsibles.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={cl.contentActionBlock}>
                                <div className={`d-flex flex-row align-items-center`}>
                                    <Button onlyIcon={true} className={cl.likeBtn} title='Убрать из приоритетных' onClick={() => setShowRemoveAlert(true)}>
                                        <i className="mdi mdi-star"></i>
                                    </Button>
                                </div>
                                <div className={cl.dateContainer}>
                                    <i className="mdi mdi-calendar-month"></i>
                                    <span className={cl.date}>{createDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cl.taskNameContainer}>
                        <div className={cl.taskNameBorder}></div>
                        <div className={cl.nameContent}>
                            <div className={cl.taskSvgContainer}><GoalLineSVG styleProps={{width: '42px', height: '42px', fill: '#0078D4'}}/></div>
                            <div className={cl.title}>{strategy.title}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}