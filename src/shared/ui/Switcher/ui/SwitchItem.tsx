import './SwitcherItem.scss';

export type SwitchItemType = {
    icon: any,
    label: string | undefined,
    onClick: any,
    isActive: boolean | undefined,
}

export const SwitchItem = (props: SwitchItemType) => {
    const activeClass = props.isActive ? 'switcherItem_active' : '';

    return (
        <div className={"switcherItem " + activeClass} onClick={props.onClick}>
            <div className="switcherItem__icon">{props.icon}</div>
            <div className="switcherItem__label">{props.label}</div>
        </div>
    )
}

export default SwitchItem;