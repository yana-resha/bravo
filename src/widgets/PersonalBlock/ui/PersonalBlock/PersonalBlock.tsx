import cl from './personalBlock.module.scss';
import backgroundImage from '../../assets/img/background.png';
import defaultAvatar from '../../../../shared/assets/img/users/default-avatar.png';
import { Button } from '@/shared/ui/Button';
import 'react-circular-progressbar/dist/styles.css';
import GoalLineSVG from '@/shared/ui/svg/GoalLineSVG/GoalLineSVG';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { useEffect, useState } from 'react';
import { Progress } from '@/shared/ui/Progress';
import { progresses } from '@/shared/ui/Progress/data/progressData';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { StrategyTargetItemType } from '@/shared/types/StrategyTargetItemType';
import { fetchStrategyTargetList } from '@/entities/StrategyTarget/model/slices/strategyTargetSlice';


type BlockProps = {
    classes?: string,
}

export function PersonalBlock ({classes} : BlockProps) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const userIsLoading = useSelector((state: StoreReducerType) => state?.userData.isLoading);
    const userError = useSelector((state: StoreReducerType) => state?.userData.error);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const strategyTargetsList = useSelector((state: StoreReducerType) => state.strategyTarget.strategyTargetsList.list);
    
    useEffect(() => {
        dispatch( fetchStrategyTargetList({ login: currentUser.login }) );
    }, [currentUser]);

    const suitableTargets: StrategyTargetItemType[] = strategyTargetsList
        .filter((target: StrategyTargetItemType) => {
            // if (target.responsibles !== null) {
            //     const coincidenceResponsible = target.responsibles
            //         .findIndex((responsible) => responsible.login === currentUser.login);

            //     return coincidenceResponsible !== -1;
            // }

            return false;
        })
        .slice(0, 3);
    
    return (
        <div
        className={`
        ${cl.personalBlock}
        ${classes ? classes : ''}
        `}
        >
            <div className={`${cl.topBlock}`}>
                <div className={`${cl.backgroundBlock}`}>
                    <img src={backgroundImage}/>
                    <svg xmlns="http://www.w3.org/2000/svg" width="204" height="111" viewBox="0 0 204 111" fill="none"><rect x="37.4634" y="0.976562" width="63.0854" height="63.0854" rx="7.00486" fill="white" fillOpacity="0.13"/><rect x="0.349609" y="26.9551" width="63.0854" height="63.0854" rx="7.00486" fill="white" fillOpacity="0.13"/><rect x="133.943" y="46.0029" width="29.7706" height="29.7706" rx="7.00486" fill="white" fillOpacity="0.13"/><rect x="116.429" y="58.2588" width="29.7706" height="29.7706" rx="7.00486" fill="white" fillOpacity="0.13"/><rect x="181.398" y="79.0283" width="21.9736" height="21.9736" rx="7.00486" fill="white" fillOpacity="0.13"/><rect x="168.472" y="88.0742" width="21.9736" height="21.9736" rx="7.00486" fill="white" fillOpacity="0.13"/></svg>
                </div>

                <div className={`${cl.topBlockContent}`}>
                    <div className={cl.userBlock}>

                        <div className='d-flex flex-row align-items-start'>
                            <img src={currentUser.avatar ? currentUser.avatar  : defaultAvatar} 
                            className={`rounded-circle border border-white border-4 me-2 ${cl.userAvatar}`} 
                            />
                            <div style={{paddingTop: '5%'}}>
                                <div className={`${cl.userName}`}>
                                    {currentUser.fio ? currentUser.fio : ''}
                                </div>
                                <div className={`${cl.userPosition}`}>
                                    {currentUser.ADdescription ? currentUser.ADdescription : ''}
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={`${cl.targetList}`}>
                        {/* 
                        #TODO временно убираем блок 
                        <Button onlyIcon={true} className={`${cl.editBtn}`}>
                            <i className="ri-edit-fill fs-20 text-white"></i>
                        </Button>
                        */}
                        {
                            suitableTargets.length !== 0
                            &&
                            <>
                                <div className={`${cl.listBorder}`}></div>
                                <div className={`${cl.listItems}`}>
                                    {suitableTargets.map((target) => {
                                        return (
                                            <div className={`${cl.listItem}`}>
                                                <GoalLineSVG styleProps={{width: '35px', height: '35px', fill: '#23538F', marginRight: '6px'}}/>
                                                {target.title}
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                        
                    </div>
                </div>
            </div>


            <div className={`${cl.bottomBlock}`}>
                <div className={`${cl.progressList} py-3`}>
                    {/* #TODO: Временно убираем отображение блока */}
                    {/* {progresses.map((progressData, key) => <Progress key={key} progressData={progressData} />)} */}
                </div>
            </div>
        </div>
    )
}