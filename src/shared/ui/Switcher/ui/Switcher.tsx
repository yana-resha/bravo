import { useEffect, useState } from 'react';
import SwitchItem from './SwitchItem';

export const Switcher = ({ items }: any) => {
    const [indexActiveItem, setIndexActiveItem] = useState<number>(0);

    useEffect(() => {

    }, [indexActiveItem])

    return (
        <div className='switcher'>
            {items.map((item: any, index: number) => {
                const handlerClick = () => {
                    setIndexActiveItem(index);
                    item.onClick();
                }

                return (
                    <SwitchItem 
                        key={'switchItem' + index} 
                        label={item.label} 
                        icon={item.icon} 
                        onClick={handlerClick} 
                        isActive={index === indexActiveItem}
                    />
                )
            })}
        </div>
    )
}