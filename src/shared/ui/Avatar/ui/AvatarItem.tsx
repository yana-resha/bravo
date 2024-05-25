import { TooltipWhite } from "../../TooltipWhite";
import { AvatarItemType } from "../types/AvatarGroupType";
import defaultAvatar from '../../../assets/img/users/default-avatar.png';

export function AvatarItem (item: AvatarItemType) {
    return (
        <TooltipWhite withoutMaxWidth={true} position='top' content={item.fio? item.fio : 'Неизвестный'}>
            <div className="avatar-group-item">
                <img className={`rounded-circle border border-white border-2 avatar-xs ${item.className}`} src={item.avatar ? item.avatar : defaultAvatar} alt="" />
            </div>
        </TooltipWhite>
    )
}