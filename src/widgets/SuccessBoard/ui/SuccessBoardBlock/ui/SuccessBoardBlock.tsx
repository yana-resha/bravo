import { FilterSelect, FilterSelectType } from '@/shared/ui/FilterSelect';
import { useState } from 'react';
import cl from './successBoardBlock.module.scss';
import { SuccessBoardList } from '../../SuccessBoardList';

type Props = {
    className?: string,
}


export function SuccessBoardBlock({className = ''}: Props) {
    
    return(

        <div
        className={`${className} ${cl.block}`}
        >
            <div className={cl.blockTitle}>Доска особых успехов</div>
            <SuccessBoardList />
        </div>
    )
}