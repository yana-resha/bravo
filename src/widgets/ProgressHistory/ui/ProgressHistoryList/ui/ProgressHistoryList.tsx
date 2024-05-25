import { useId } from 'react';
import { ProgressHistoryItem } from '../../ProgressHistoryItem';
import cl from './progressHistoryList.module.scss';

type ItemType = {
    fio: string,
}

type Props = {
    className?: string,
    list: ItemType[],
}

export function ProgressHistoryList ({list, className} : Props) {
    return (
        <div className={cl.list}>
            <div className={cl.headerRow}>
                <div className={cl.title}>Метрики</div>
                <div className={cl.title}>OKR</div>
            </div>
            {list.map(item => <ProgressHistoryItem key={useId()} {...item}/>)}
        </div>
    )
}