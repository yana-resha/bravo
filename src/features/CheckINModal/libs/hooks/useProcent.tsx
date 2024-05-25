import { useEffect, useState } from "react";

export function useProcent() {
    const [lastProcent, setLastProcent] = useState<number>(0);
    const [currentProcent, setCurrentProcent] = useState<number>(0);
    
    const changeLastProcent = (value : string | number) => {
        let validValue = 0;
        if (typeof value === 'string') {
            validValue = Number(value)??0;
        } else {
            validValue = value;
        }

        setLastProcent(validValue);
    }

    const changeCurrentProcent = (value : string | number) => {
        let validValue = 0;
        if (typeof value === 'string') {
            validValue = Number(value)??0;
        } else {
            validValue = value;
        }

        if (validValue > 100) {
            validValue = 100;
        }

        setCurrentProcent(validValue);
    }

    const setValidCurrentProcent = () => {
        if (currentProcent <= 100 && currentProcent >= lastProcent) {
            return;
        } else {
            if (currentProcent < lastProcent) {
                changeCurrentProcent(lastProcent);
            } else if (currentProcent > 100) {
                changeCurrentProcent(100);
            }
        }
    }

    

    return {
        lastProcent, currentProcent, changeLastProcent, changeCurrentProcent, setValidCurrentProcent
    }

}