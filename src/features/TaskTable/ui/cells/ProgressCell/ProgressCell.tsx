
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import getProgressColor from "@/entities/task/utils/getProgressColor";
import { TooltipWhite } from "@/shared/ui/TooltipWhite";
import './ProgressCell.scss';

type ProgressCellProps = {
    progress: OKRItemType['progress'],
    calcType: OKRItemType['calcType'],
}

export function ProgressCell ({progress, calcType} : ProgressCellProps) {
    return (
        <>
            <span 
            // style={{color: getProgressColor(progress??0)}}
            >
                {progress??0} %
            </span>  
            <TooltipWhite
                position='top'
                content={calcType ? 'Автоматический режим определения прогресса' : 'Ручной режим определения прогресса'}
            > 
                <div className={'TaskItem__progress-type'} title=''>{calcType ? 'A' : 'P'}</div>
            </TooltipWhite> 
            
        </>
    )
}