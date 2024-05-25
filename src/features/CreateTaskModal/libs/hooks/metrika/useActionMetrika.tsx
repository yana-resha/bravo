import { useEffect, useState } from "react";
import { MetrikaPeriodType } from "../../../types/MetrikaPeriodType";
import moment from "moment";

export type MetricaActionProps = {
    period: MetrikaPeriodType | null,
    
}

export function useActionMetrika({period}: MetricaActionProps) {
    const dateFormat = 'YYYY-MM-DD';
    const [metrikaStart, setMetrikaStart] = useState<undefined | string>(undefined);
    const [metrikaEnd, setMetrikaEnd] = useState<undefined | string>(undefined);
    const [metrikaStartMin, setMetrikaStartMin] = useState(moment().format(dateFormat));
    const [metrikaEndMin, setMetrikaEndMin] = useState(moment().format(dateFormat));
    const [metrikaEndCheckValue, setMetrikaEndCheckValue] = useState(false);


    const setMinMetricaStartDate = (date: string | null) => {
        let newDate = moment(date).format(dateFormat);
        console.log(date, '222', newDate)
        if (newDate !== 'Invalid date') {
            setMetrikaStartMin(newDate);
        } 
    }


    const metrikaStartHandler = (value: any) => {
  
        if (value) setMetrikaEndMin(value);
        if (value && moment(metrikaEnd).isBefore(value)) {
            setMetrikaEnd(undefined);
        }
        setMetrikaStart(value);
    }

    
    const metrikaEndHandler = (value: any) => {
        setMetrikaEnd(value);
        if (value && moment(metrikaStart).isAfter(value)) {
            setMetrikaStart(undefined)
        }
    }

    const changeMetrikaEndCheckValue = (value: boolean): void => {
        setMetrikaEndCheckValue(value);
    } 
    useEffect(() => {
        if (metrikaEnd) changeMetrikaEndCheckValue(false);
    }, [metrikaEnd]);

    useEffect(() => {
        setMetrikaEnd(undefined);
        setMetrikaStart(undefined);
        setMetrikaEndMin(moment().format(dateFormat));
    }, [period])

    return {
        setMinMetricaStartDate,
        metrikaStart, 
        metrikaEnd, 
        metrikaStartHandler,
        metrikaEndHandler,
        metrikaStartMin,
        metrikaEndMin,
        metrikaEndCheckValue,
        changeMetrikaEndCheckValue
    }
}