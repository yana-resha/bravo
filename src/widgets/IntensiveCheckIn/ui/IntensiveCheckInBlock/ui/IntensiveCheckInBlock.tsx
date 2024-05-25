import { useState } from "react";
import cl from './intensiveCheckInBlock.module.scss';
import { IntensiveCheckInTable } from "../../IntensiveCheckInTable";

export function IntensiveCheckInBlock () { 

    return(
        <div className={cl.block}>
            <div className={cl.blockTitle}>
                Интенсивность Check in за последние 12 недель
            </div>
            <IntensiveCheckInTable />
        </div>
    )
}