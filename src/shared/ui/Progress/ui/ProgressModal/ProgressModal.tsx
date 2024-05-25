import cl from './ProgressModal.module.scss';
import { Button } from '@consta/uikit/Button';
import 'react-circular-progressbar/dist/styles.css';
import { ProgressBar, typeProgressBar } from '../ProgressBar/ProgressBar';
import { Modal } from '@consta/uikit/Modal';
import { Details, Stats } from '../../data/progressData';
import { IconArrowDown } from '@consta/icons/IconArrowDown';
import { useId, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { BadgePropsType } from '@/shared/ui/Badge';

type Props = {
    name: string;
    isOpened: boolean;
    closeHandler: () => void;
    SVGIcon: JSX.Element;
    completedCount: number;
    progress: number;
    complexity: string;
    description: string;
    stats: Stats;
    details: Details;
}

export function ProgressModal({
    name, 
    closeHandler, 
    isOpened, 
    SVGIcon, 
    completedCount, 
    progress, 
    complexity, 
    description,
    stats,
    details
}: Props) {
    const [isCollapseOpen, setIsCollapseOpen] = useState(false);
    const color = (() => {
        if (progress <= 25) {
            return {progress: '#FF3731', badge: 'danger' as BadgePropsType['theme']};
        } else if (progress > 25 && progress <= 75) {
            return {progress: '#FDC748', badge: 'warning' as BadgePropsType['theme']};
        } else {
            return {progress: '#90C171', badge: 'calm-green' as BadgePropsType['theme']};
        }
    })();
    
    return (
        <Modal 
            className={`${cl.progressModal}`}
            isOpen={isOpened}
            onClickOutside={closeHandler}
            onEsc={closeHandler}
            hasOverlay
        >
            <button className={`${cl.progressCloseButton}`} type="button" onClick={closeHandler}>Закрыть окно</button>
            <div className={`${cl.progressModalTop}`}>
                <ProgressBar key={useId()} type={typeProgressBar.div} name={name} isVisibilityName={true} SVGIcon={SVGIcon} completedCount={completedCount} progress={progress} />
                <p className={`${cl.progressComplexity}`}>{complexity}</p>
                <p className={`${cl.progressDescription}`}>{description}</p>
                <ul className={`${cl.progressAchievements}`}>
                    {stats.map((stat) => {
                        return (
                            <li key={useId()} className={`${cl.progressAchievement} ${cl.progressAchievementError}`}>
                                <p className={`${cl.progressAchievementCount}`}>{stat.count}</p>
                                <p className={`${cl.progressAchievementDescription}`}>{stat.text}</p>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <button 
                className={`${cl.progressDetailsButton} ${isCollapseOpen && cl.progressDetailsButtonOpened}`} 
                onClick={() => setIsCollapseOpen(!isCollapseOpen)}
                aria-controls="example-collapse-text"
                aria-expanded={isCollapseOpen} 
            >
                Как это работает?
                <IconArrowDown className={`${cl.progressDetailsButtonArrow}`} />
            </button>

            <Collapse in={isCollapseOpen}>
                <div className={`${cl.progressDetails}`} id='example-collapse-text'>
                    {details.map((detail) => {
                        return (
                            !detail.icon
                                ? (
                                    <p key={useId()} className={`${cl.progressDetailsP}`}>
                                        <span 
                                            className={`${cl.progressCompletedCount} ${cl.progressDetailsIcon}`}
                                            style={{backgroundColor: color.progress}}
                                        >{completedCount}</span>
                                        {detail.text}
                                    </p>
                                )
                                : (
                                    <p key={useId()} className={`${cl.progressDetailsP}`}>
                                        <img 
                                            className={`${cl.progressDetailsIcon}`} 
                                            src={detail.icon}
                                            width={30} 
                                            height={30}
                                            aria-hidden="true" 
                                        />
                                        {detail.text}
                                    </p>
                                )
                        )
                    })}
                </div>
            </Collapse>
            <Button className={`${cl.progressButton}`} label='ОК' size='s' onClick={closeHandler} />
        </Modal>
    )
}
