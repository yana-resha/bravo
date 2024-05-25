
import { OKRItemType } from '../../types/OKRItemType';
import { OKRItem } from '../OKRItem/OKRItem';
import cl from './OKRBlock.module.scss';



const OKRList: OKRItemType [] = [
    {
        title: 'Увеличить доход от бизнеса Экспресс-Гарантий',
    },

    {
        title: 'ИТ-Компания Сколково',
    },
]

export function OKRBlock() {
    return (
        <div className={cl.block}>
            <div className={cl.list}>
                {OKRList.map((item, index)=> <OKRItem key={index} {...item}/>)}
            </div>
        </div>
    )
}