import { countClosedComplexityByQuartal } from "@/entities/task/api/okrAPI";
import { OKRDRComplexityInQuartalCell } from "@/features/OKRDRTable/types/OKRDRRowProps";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

export function ComplexityInQuartalCell ({login, isLoading, complexitySum, nextDayQuartal, changeValuesFunc}: OKRDRComplexityInQuartalCell) {
    const getComplexityCount = async () => {
        changeValuesFunc(nextDayQuartal, 'isLoading', true);
        changeValuesFunc(nextDayQuartal, 'tasks', []);
        changeValuesFunc(nextDayQuartal, 'complexitySum', 0);
        try {
            let response = await countClosedComplexityByQuartal({login: login, quartal: nextDayQuartal});
            if (response && response.length > 0) {
                let val = response.map(el => el.complexity??0).reduce((prevVal: number, nextVal: number) => prevVal + nextVal);
                changeValuesFunc(nextDayQuartal, 'tasks', response);
                changeValuesFunc(nextDayQuartal, 'complexitySum', val);
            }   
        } catch (error: any) {
            console.log(error);
        } finally {
            changeValuesFunc(nextDayQuartal, 'isLoading', false);
        }
    }

    useEffect(() => {
        getComplexityCount();
    }, []);

    return (
        <>
        {
            !isLoading && (
                complexitySum??'-'
            )
        }
        {
            isLoading && (
                <Spinner animation="border" size="sm" variant="primary" />
            )
        }

        </>
    )
}