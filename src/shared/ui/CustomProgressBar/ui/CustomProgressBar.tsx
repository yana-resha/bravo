import CheckFillSVG from '@/shared/ui/svg/CheckFillSVG/CheckFillSVG';
import cl from './customProgressBar.module.scss';
import ProgressBar from "@ramonak/react-progress-bar";
import WarningFillSVG from '@/shared/ui/svg/WarningFillSVG/WarningFillSVG';
import CancelFillSVG from '@/shared/ui/svg/CancelFillSVG/CancelFillSVG';
import { ProgressBarProps } from '../types/progressBarProps';
import { useEffect, useState } from 'react';

const progressColor = {
    danger: '#F00',
    warning: '#FFB100',
    success: '#42BD53',
}

const progressIcon = {
	danger: <CancelFillSVG styleProps={{height: '85%', fill: '#FFF'}}/>,
	warning: <WarningFillSVG styleProps={{height: '85%', fill: '#FFF'}}/>,
	success: <CheckFillSVG styleProps={{height: '85%', fill: '#FFF'}}/>,
}

export function CustomProgressBar({status, maxCompleted, completed, height, borderRadius, showLabel, subfix = '', passingScore, withIcon = true}: ProgressBarProps) {
    let [passingScoreValue, setPassingScoreValue] = useState < null | Number>(null);
    
    useEffect(() => {
		if (passingScore) {
			let x = 1;
			if (maxCompleted) {
				x = maxCompleted / 100;
			}
			setPassingScoreValue(passingScore / x)
		}
    }, [passingScore, maxCompleted])

    return (
		<div className='d-flex flex-row align-items-center'>
        	<div className='position-relative w-100'>
				{withIcon && (
					<div className={cl.statusIcon}>
						{status ? progressIcon[status] : progressIcon['danger']}
					</div>
				)}
				
				{passingScoreValue && 
					<div className={cl.passingScore} style={{left: `${passingScoreValue}%`}}>
						<div className={cl.passingScoreBorder}></div>
						<div className={cl.passingScoreText}>{passingScore}{subfix}</div>
					</div>
				}

				<ProgressBar 
					completed={completed ? completed : 0}
					baseBgColor='rgba(226, 232, 227, 1)'
					bgColor={status ? progressColor[status] : progressColor['danger']}
					maxCompleted={maxCompleted ? maxCompleted : 0}
					isLabelVisible={false}
					height={height ? height : '17px'}
					borderRadius={borderRadius ? borderRadius : '4px'}
				/>
          	</div> 
            {showLabel && 
            	<span className={cl.label}> {completed}{subfix} </span>
            }
      	</div>
    )
}




