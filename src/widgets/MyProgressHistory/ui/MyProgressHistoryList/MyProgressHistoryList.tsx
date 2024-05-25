import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import cl from './myProgressHistoryList.module.scss';
import { StarList } from '@/shared/ui/StarList';
import HeartPulseSVG from '@/shared/ui/svg/HeartPulseSVG/HeartPulseSVG';
import { HistoryProgressStats } from '@/widgets/MyProgressHistory/types/ProgressHistoryStats';

type MyProgressHistoryListProps = HistoryProgressStats;

export function MyProgressHistoryList ({ percentByMetrics, sumComplexityByORKs }: MyProgressHistoryListProps) {
    const progressColor = (() => {
        if (percentByMetrics === '–' || percentByMetrics <= 25) {
            return '#FF3731';
        } else if (percentByMetrics > 25 && percentByMetrics <= 75) {
            return '#FDC748';
        } else {
            return '#90C171';
        }
    })();

    return (
        <div className={cl.list}>
            <div>
                <div className={cl.row}>
                    <div className={cl.rowTitle }>Метрики</div>
                    {percentByMetrics === '–' 
                        ? percentByMetrics
                        : (
                            <div className={cl.progressContainer}>
                                <CircularProgressbarWithChildren
                                    value={percentByMetrics}
                                    strokeWidth={10}
                                    styles={
                                        buildStyles({
                                            pathColor: progressColor,
                                            trailColor: "#CBD2DD",  
                                        })
                                    }
                                >
                                    <span className={cl.progressValue}>{percentByMetrics}%</span>
                                </CircularProgressbarWithChildren>
                            </div>
                            )
                        }
                </div>

                <div className={cl.row}>
                    <div className={cl.rowTitle}>OKR</div>
                    <div className={cl.averageProgress}>
                        <StarList value={1} status="success"/>
                        <span className={cl.valueText}>{sumComplexityByORKs}</span>
                    </div>
                </div>
            </div>
            <div className='d-flex align-items-center'>
                <div className={cl.border}></div>
            </div>
            <div className={cl.commonStatus}>
                <HeartPulseSVG styleProps={{width: '70px', height: '70px', fill: '#F29D38'}}/>
            </div>
        </div>
    )
}