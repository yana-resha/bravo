import { IconArrowDown } from '@consta/icons/IconArrowDown';
import cl from './ArrowBtn.module.scss';
import { PropsType } from '../types/PropsType';

export function ArrowBtn (props : PropsType) {
    const {state, toggleFunc, className, size, borderLeft, borderRight} = props;
    return (
        <div 
        className={`${borderLeft ? 'border-start' : ''} ${borderRight ? 'border-end' : ''} d-flex ${cl.arrowIconBlock} ${state ? cl.transformIcon : ''} ${cl.className??''}`} 
        onClick={() => toggleFunc()}
        >
            <IconArrowDown size={size ? size : 'm'}/>
        </div>
    )
}