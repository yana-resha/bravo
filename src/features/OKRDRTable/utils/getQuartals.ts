import moment from "moment";
import { QuartalType } from "../types/QuartalType";

export function getQuartals() : QuartalType [] {
    const finallArr: QuartalType[] = [];
    let counter = 0;
    for (let i = 0; i < 4; ++i) {
        const quartal = moment().subtract(counter, 'Q').format('YYYY-MM-DD');
        const nextDate = moment(moment().subtract(counter, 'Q').add(1, 'Q')).startOf('Q').format('YYYY-MM-DD');
        ++counter;
        finallArr.push({
            label: moment(quartal).format('Qкв. YYYY'),
            nextDayQuartal: nextDate,
        })
        
    }

    
    return finallArr;
}