import { useState } from "react";

export function useWeight() {

    const [weightValue, setWeightValue] = useState<number>(0);
    const changeWeightValue = (val: string | number) => {
        let value = Number(val)??0;
        if (value < 0) {
            value = 0;
        } else if (value > 100) {
            value = 100;
        }
        setWeightValue(value)
    }
    
    return {
        weightValue,
        changeWeightValue,
    };
}