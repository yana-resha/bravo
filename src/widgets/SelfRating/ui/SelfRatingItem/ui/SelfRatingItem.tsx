import { useId,  } from "react";
import cl from './selfRatingItem.module.scss';
import { RatingItemType } from "@/widgets/SelfRating/types/RatingItemType";
import avatarDefault from '../../../../../shared/assets/img/users/default-avatar.png';
import AlertSVG from "@/shared/ui/svg/AlertSVG/AlertSVG";
import { Badge } from "@/shared/ui/Badge";
import { StarList } from "@/shared/ui/StarList";
import { bgThemeEnum } from "@/shared/ui/Badge/types/badgeProps";
  

export function SelfRatingItem ({...item} : RatingItemType) { 

    const {fio, averageValue, tasks, alert} = item;


    return(

        <div className={cl.item}>
            <div className={cl.nameCol}>
                <div className="me-3">
                    <img src={avatarDefault} alt="" className="rounded-circle border border-white border-2 avatar-sm" />
                </div>
                <div className={cl.fioText}>
                    {fio}
                </div>
            </div>

            <div className={cl.tasksCol}>
                <div className={`flex-grow-1`}>
                    
                    {tasks.map(task => 
                        <span key={useId()} className={cl.starCell}>
                            <StarList value={task.value} status={task.status}/>
                        </span>
                    )}
                </div>
                {alert && (
                    <div>
                        <span className="position-relative">
                            <AlertSVG styleProps={{width: '25px', height: '25px', fill: '#D65B01'}}/>
                            <Badge theme={bgThemeEnum.terra} borderRadius="circle" className={cl.customBadge}
                            >{alert}</Badge>
                        </span>
                    </div>
                )}
            </div>

            <div className={cl.averageCol}>
                    <StarList value={1} status="success"/>
                    <span className={cl.valueText}>{averageValue}</span>
            </div>
        </div>
        
    )
}