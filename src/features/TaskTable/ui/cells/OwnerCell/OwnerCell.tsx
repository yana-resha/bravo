
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import { AvatarItem } from "@/shared/ui/Avatar";
import { TooltipWhite } from "@/shared/ui/TooltipWhite";
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';

type OwnerCellProps = {
    responsibles: OKRItemType['responsibles'],
}

export function OwnerCell ({responsibles} : OwnerCellProps) {

    
    return (
        <>
            <TooltipWhite
                position='top'
                content={responsibles[0].fio}
            > 
                <AvatarItem avatar={responsibles[0].avatar ? responsibles[0].avatar : defaultAvatar}/>
            </TooltipWhite>  
            
        </>
    )
}