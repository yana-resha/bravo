import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import cl from './progressHistoryItem.module.scss';
import { StarList } from '@/shared/ui/StarList';
import HeartPulseSVG from '@/shared/ui/svg/HeartPulseSVG/HeartPulseSVG';

type ItemType = {
    fio: string,
}


export function ProgressHistoryItem (item : ItemType) {
    return (
        <div className={cl.item}>
            <div className={cl.metrikaRow}>
                <div className='d-flex'>
                    <div className={cl.monthProgress}>
                        <div className={`${cl.circleProgress} ${cl.dangerCircle}`}></div>
                        <div className={`${cl.progressPoint}`}>4</div>
                    </div>
                </div>
                
                <div className='d-flex'>
                    
                    <div className={cl.monthProgress}>
                        <div className={`${cl.circleProgress} ${cl.warningCircle}`}></div>
                        <div className={`${cl.progressPoint}`}>2</div>
                    </div>
                </div>
                <div className='d-flex'>
                    <div className={cl.monthProgress}>
                        <div className={`${cl.circleProgress} ${cl.successCircle}`}></div>
                        <div className={`${cl.progressPoint}`}>5</div>
                    </div>
                </div>

                <div className='d-flex'>
                    <div className={cl.monthProgress}>
                        <div className={`${cl.circleProgress}`}></div>
                        <div className={`${cl.progressPoint}`}>0</div>
                    </div>
                </div>
                <div className={cl.periodProgress}>
                
                        <CircularProgressbarWithChildren
                        value={65} 
                        strokeWidth={10}
                        styles={
                            buildStyles({
                                pathColor: "#44DFC1",
                                trailColor: "#CBD2DD",  
                            })
                        }
                        >
                            <span className={cl.progressbarText}>60%</span>
                        </CircularProgressbarWithChildren>
                    
                </div>
            </div>
            
            <div className={cl.border}></div>
            
            <div className={cl.okrRow}>
                <div className={cl.starCell}>
                    <StarList value={1} status="success" classList='me-1'/>
                    <span className={cl.starValue}>20.0</span>
                </div>
                <div className={cl.heardCell}>
                    <HeartPulseSVG styleProps={{width: '40px', height: '40px', fill: '#F29D38'}}/>
                </div>
            </div>
        </div>
    )
}