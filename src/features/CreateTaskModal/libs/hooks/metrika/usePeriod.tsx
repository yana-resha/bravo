import { useState } from "react";
import { MetrikaPeriodType } from "../../../types/MetrikaPeriodType";


export const metrikaPeriodItems : MetrikaPeriodType[] = [
    
    {
        id: 'Ежемесячно', 
        label: 'Ежемесячно',
    },

    {
        id: 'Ежеквартально', 
        label: 'Ежеквартально',
    },
];

export function usePeriod() {
    const metrikaPeriodList = [metrikaPeriodItems[0]];
    const [metrikaPeriod, setMetrikaPeriod] = useState<MetrikaPeriodType | null>(metrikaPeriodList[0]);
    const metrikaPeriodHandler = (id: MetrikaPeriodType['id'] | null | undefined) => {
        if (id) {
            let item = metrikaPeriodList.find(el => el.id == id);
            setMetrikaPeriod(item??null);
        } else {
            setMetrikaPeriod(null)
        }
        
    }
    return {
        metrikaPeriodList, metrikaPeriod, metrikaPeriodHandler,
    }
}