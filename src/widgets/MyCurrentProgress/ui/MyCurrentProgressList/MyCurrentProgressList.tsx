import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './myCurrentProgressList.scss';
import cl from './myCurrentProgressList.module.scss';
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { StarList } from "@/shared/ui/StarList";
import AlertSVG from "@/shared/ui/svg/AlertSVG/AlertSVG";
import { Badge } from "@/shared/ui/Badge";
import { bgThemeEnum } from "@/shared/ui/Badge/types/badgeProps";
import { CurrentProgressData } from "@/entities/progress";
import { IconForward } from '@consta/icons/IconForward';
import { IconBackward } from '@consta/icons/IconBackward';
import Slider from "react-slick";

import { useId, useRef } from 'react';

type ArrowProps = {
    className?: string;
    style?: object;
    onClick?: () => void;
}

type PropsType = {
    progressData: CurrentProgressData,
}

export function MyCurrentProgressList ({ progressData } : PropsType) {
    const sliderRef = useRef(null);
    const remainderComplexity = 10 - progressData.reduce((accum, current) => {
        if (current.type === 'task') {
            return accum + current.complexity;
        }

        return accum;
    }, 0);

    const isHasArrows = progressData
        .filter(({type}) => type === 'metric')
        .length > 5;

    const SampleNextArrow = (props: ArrowProps) => {
        const { className, style, onClick } = props;
        return (
            <button 
                className={`${cl.sliderButton} ${cl.sliderButtonRight} ${className}`}
                style={style}
                type="button"
                onClick={onClick}
                aria-description="Предыдущий квартал"
            >
                <IconForward />
            </button>
        );
      }
      
      const SamplePrevArrow = (props: ArrowProps) => {
        const { className, style, onClick } = props;
        return (
            <button 
            className={`${cl.sliderButton} ${cl.sliderButtonLeft} ${className}`}
            style={style}
            type="button"
            onClick={onClick}
            aria-description="Следующий квартал"
        >
            <IconBackward />
        </button>
        );
      }

    const sliderSettings = {
        dots: false,
        infinite: false,
        arrows: isHasArrows,
        draggable: false,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: isHasArrows ? <SampleNextArrow /> : undefined,
        prevArrow: isHasArrows ? <SamplePrevArrow /> : undefined
    }    
    
    return  (
        <div className={cl.list}>
            <div className={cl.row}>
                <div className={cl.rowTitle}>Метрики</div>
                <div className={`${cl.slider}`}>
                    <Slider ref={sliderRef} {...sliderSettings}>
                        {progressData.map((progress) => {
                            if (progress.type === 'metric') {
                                const progressColor = (() => {
                                    if (progress.progress <= 25) {
                                        return '#FF3731';
                                    } else if (progress.progress > 25 && progress.progress <= 75) {
                                        return '#FDC748';
                                    } else {
                                        return '#90C171';
                                    }
                                })();
        
                                return (
                                    <div className={cl.progressContainer} key={useId()}>
                                        <CircularProgressbarWithChildren
                                            value={progress.progress} 
                                            strokeWidth={10}
                                            styles={buildStyles({
                                                pathColor: progressColor,
                                                trailColor: "#CBD2DD",
                                            })
                                        }
                                        >
                                            <span className={cl.progressValue}>{Math.round(progress.progress)}%</span>
                                        </CircularProgressbarWithChildren>
                                    </div>
                                )
                            }
                        })}
                    </Slider>
                </div>
            </div>
            <div className={cl.row}>
                <div className={cl.rowTitle}>OKR</div>
                <div className={`${cl.valueRow}`}>
                    {progressData.map((progress) => {
                        if (progress.type === 'task') {
                            const starsStatus = (() => {
                                if (progress.status === 'по плану') {
                                    return 'success';
                                } else if (progress.status === "под угрозой") {
                                    return 'danger';
                                } else {
                                    return 'warning';
                                }
                            })();                            
    
                            return <StarList classList={cl.starItem} value={progress.complexity} status={starsStatus}  key={useId()}/>;
                        }
                    })}
                    {remainderComplexity > 0 && 
                        <span className="position-relative">
                            <AlertSVG styleProps={{width: '25px', height: '25px', fill: '#D65B01'}}/>
                            <Badge theme={bgThemeEnum.terra} borderRadius="circle" className={cl.customBadge}>{remainderComplexity}</Badge>
                        </span>
                    }
                </div>
            </div>
        </div>
        
    )
}