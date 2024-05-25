import { addBtnType } from "../types/AvatarGroupType";

export function AvatarAddBtn(props: addBtnType) {

    const {onClick, btnTitle} = props;

    return (
        <button className="rounded-circle border border-dashed border-white border-2 avatar-xs" 
        onClick={onClick}
        title={btnTitle ? btnTitle : ''}
        >
            +
        </button>
    )
}