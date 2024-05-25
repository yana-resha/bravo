import { useEffect, useId } from "react";
import { TooltipWhite } from "../../TooltipWhite";
import { AvatarNullType } from "../types/AvatarGroupType";
import cl from './avatarGroup.module.scss';

export function AvatarItemNull ({items} : AvatarNullType) {

    return (
        <TooltipWhite position='top' content={
                <>
                    {items.map(item => <div key={useId()}>{item.fio ? item.fio : 'Неизвестный'}</div>)}
                </>
            }>
            <div className={`avatar-group-item avatar-xs border border-white border-2 rounded-circle ${cl.hiddenAvatars}`}>
            +{items.length}
            </div>
        </TooltipWhite>
    )
}