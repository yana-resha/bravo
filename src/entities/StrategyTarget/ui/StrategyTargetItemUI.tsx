import { useEffect, useRef, useState } from 'react';

/* Components */
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { Dropdown } from "react-bootstrap";
import { StarList } from "@/shared/ui/StarList";
import { CustomDropdownToggle } from "@/shared/ui/CustomDropdownToggle";
import { Button } from "@/shared/ui/Button";
import { AvatarGroup as CustomAvatarGroup } from "@/shared/ui/Avatar";

/* Icons */
import GoalLineSVG from "@/shared/ui/svg/GoalLineSVG/GoalLineSVG";
import { IconAdd } from "@consta/icons/IconAdd";
import { IconKebab } from "@consta/icons/IconKebab";

/* Types */
import { IStrategyTarget } from '../types/StrategyTargetTypes';
import { ResponsibleType } from "@/shared/types/responsibleType";

/* Styles */
import './StrategyTargetItemUI.scss';
import { CreateTaskModal } from "@/features/CreateTaskModal";
import { CreateTaskSettings } from "@/features/CreateTaskModal/types/ModalPropsType";
import { DeleteTaskAlert } from '@/features/DeleteTaskAlert';
import { CreateTargetModal } from '@/features/CreateTargetModal';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';


export const StrategyTargetItemUI = (props: IStrategyTarget) => {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);

    const {id, taskType} = props;
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const responsibles: ResponsibleType[] | [] = props.responsibles ?? [];

    const initialModalSetting: CreateTaskSettings = {type: null, idStrategy: props.id};
    const [createTaskSettings, setCreateTaskSettings] = useState<CreateTaskSettings>(initialModalSetting);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const closeCreateModal = () => {
        setShowCreateTaskModal(false);
    }

    const closeEditModal = () => {
        setShowEditTaskModal(false);
    }

    return (
        <>
        {showDeleteAlert && <DeleteTaskAlert taskType={taskType} id={id} setCloseAlert={() => setShowDeleteAlert(false)}/>}
        {showCreateTaskModal && <CreateTaskModal createSettings={createTaskSettings} closeFunc={closeCreateModal}/> }
        {showEditTaskModal && <CreateTargetModal typeModal='edit' taskID={id} closeFunc={closeEditModal}/> }
        <div className="StrategyTargetItemUI">
            <div className="StrategyTargetItemUI__leftPart">
                <div className="StrategyTargetItemUI__headline">
                    <div className="StrategyTargetItemUI__icon">
                        <GoalLineSVG styleProps={{width: '36px', height: '36px', fill: '#0078D4'}}/>
                    </div>
                    <div>
                        <div className="StrategyTargetItemUI__label">Стратегическая цель</div>
                        <div className="StrategyTargetItemUI__title">{props.title}</div>
                    </div>
                </div>
                <div className="d-none align-items-center justify-content-between">
                    <div className="StrategyTargetItemUI__status">В рамках ожиданий</div>
                </div>
            </div>
            <div className="StrategyTargetItemUI__rightPart">
                <div className='StrategyTargetItemUI__detailsGrid'>
                    <div className='d-flex h-100 align-items-center'>
                        <div className="StrategyTargetItemUI__gridValues">
                            <div className='basicLabel text-end'>
                                {props.cntMetric !== null && ('Метрики')}
                            </div>
                            <div className="StrategyTargetItemUI__diagramMetrics">
                                {props.cntMetric !== null && (
                                    <CircularProgressbarWithChildren
                                        value={Number(props.cntMetric)} 
                                        strokeWidth={10}
                                        styles={
                                            buildStyles({
                                                pathColor: "#44DFC1",
                                                trailColor: "#CBD2DD",  
                                            })
                                        }
                                    >
                                        <span className="progressbarText">{`${props.cntMetric}%`}</span>
                                    </CircularProgressbarWithChildren>
                                )}
                            </div>
                            <div className='basicLabel text-end'>
                                {props.cntOKR !==null && ('OKR')}
                            </div>
                            <div className='d-flex justify-content-center'>
                                {props.cntOKR !== null && ( 
                                    <>
                                        <StarList value={1} status="success" classList='me-1'/>
                                        <div className="StrategyTargetItemUI__countStars">
                                            {props.cntOKR}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='h-100 mt-3 text-center'>
                            <Button color="outline-light" className='me-3'>
                                2024
                                <i className="ri-filter-2-fill ms-2"></i>
                            </Button>
                        </div>
                    </div>
                    <div className='d-flex flex-row align-items-start justify-content-end'>
                        <div className='d-flex flex-column align-items-end'>
                            {currentUser.role === 'super-user' && (
                                <>
                                <Button 
                                    className="px-4 py-2 mb-2 StrategyTargetItemUI__addTaskBtn" 
                                    color='primary' 
                                    borderRadius="pill"
                                    onClick={() => {
                                        setShowCreateTaskModal(true);
                                        setCreateTaskSettings(prev => {
                                            prev.type = 'OKR';
                                            return prev;
                                        })
                                    }}
                                >
                                    <IconAdd size="s" className='me-2' style={{color: '#FFF'}} />
                                    OKR
                                </Button>
                                <Button 
                                    className="px-4 py-2 StrategyTargetItemUI__addTaskBtn mb-3" 
                                    color='primary' borderRadius="pill"
                                    onClick={() => {
                                        setShowCreateTaskModal(true);
                                        setCreateTaskSettings(prev => {
                                        prev.type = 'metric';
                                        return prev;
                                        });
                                    }}
                                >
                                    <IconAdd size="s" className='me-2' style={{color: '#FFF'}} />
                                    Метрика
                                </Button>
                                </>
                            )}
                            
                            {responsibles.length > 0 && (
                                <div className='d-flex justify-content-end'>
                                    <div className="fs-14 text-end lh-1 me-2">Ответственные<br/> члены правления</div>
                                    
                                    <CustomAvatarGroup 
                                        maxLength={responsibles.length > 5 ? 5 : responsibles.length} 
                                        items={responsibles} 
                                    />
                                </div>
                            )}
                        </div>
                        <div className="align-items-center justify-content-center">
                            {currentUser.role === 'super-user' && (
                                <Dropdown align={'start'}>
                                    <CustomDropdownToggle>
                                        <Button 
                                            size='lg' 
                                            borderRadius='circle' 
                                            className='p-0'
                                            onlyIcon={true}
                                        >
                                            <IconKebab size="l" />
                                        </Button>
                                    </CustomDropdownToggle>

                                    <Dropdown.Menu className='end-0'>
                                        <Dropdown.Item
                                            onClick={() => setShowEditTaskModal(true)}
                                        >
                                            Изменить
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => setShowDeleteAlert(true)}
                                        >
                                            Удалить
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

