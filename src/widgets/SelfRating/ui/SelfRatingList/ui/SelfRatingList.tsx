import { useId } from "react";
import cl from './selfRatingList.module.scss';
import { RatingItemType } from "@/widgets/SelfRating/types/RatingItemType";
import { SelfRatingItem } from "../../SelfRatingItem";



type ComponentListProps = {
    list: RatingItemType[],
}
    

export function SelfRatingList ({list} : ComponentListProps) { 

    return(

        <div className={cl.list}>
            {list.map(item => <SelfRatingItem key={useId()} {...item}/>)}
        </div>
        
    )
}