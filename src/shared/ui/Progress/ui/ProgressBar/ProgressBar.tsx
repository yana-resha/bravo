import cl from './ProgressBar.module.scss';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Badge, BadgePropsType} from '@/shared/ui/Badge';

export enum typeProgressBar {
    div = 'div',
    button = 'button',
} ;

type Props = {
    type: typeProgressBar;
    openHandler?: () => void;
    name: string;
    isVisibilityName: boolean;
    SVGIcon: JSX.Element;
    completedCount: number;
    progress: number;
}

export function ProgressBar({type, openHandler, name, isVisibilityName, SVGIcon, completedCount, progress}: Props) {
    const CustomTag = type as keyof JSX.IntrinsicElements;
    const progressItemClasses = `${cl.progressItem} ${(progress >= 100)
        ? cl.progressItemComplated
        : ''
    }`;
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
        <CustomTag className={progressItemClasses} onClick={openHandler}>
            <div className={`${cl.progressBar}`}>
                <Badge borderRadius='circle' theme={color.badge} className={`${cl.progressBG} fs-10`}>{completedCount}</Badge>
                <CircularProgressbarWithChildren
                    strokeWidth={10}
                    styles={
                        buildStyles({
                            textColor: color.progress,
                            pathColor: color.progress,
                            trailColor: "#8D8794", 
                        })
                    }
                    value={progress}
                >
                    {SVGIcon}
                </CircularProgressbarWithChildren>
            </div>
            {isVisibilityName && <span className={`${cl.progressItemText}`}>{name}</span>}
        </CustomTag>
    )
}
