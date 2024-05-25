import { OKRDRRowProps } from '../../types/OKRDRRowProps';
import { EmployeeCell } from '../RowCells/EmployeeCell/EmployeeCell';
import { ComplexityInQuartalCell } from '../RowCells/ComplexityInQuartalCell/ComplexityInQuartalCell';
import { useEffect, useState } from 'react';
import { ChangeQuartalValuesFunc, QuartalValuesType } from '../../types/QuartalType';

export function TableRow ({responsible, quartals, isVisible = true} : OKRDRRowProps) {
    const [quartalValues, setQuartalValues] = useState<QuartalValuesType[]>(quartals.map((quartal) => {
        return {
            ...quartal,
            isLoading: false,
            tasks: [],
            complexitySum: 0,
        }
    }));

    const changeQuartalValue: ChangeQuartalValuesFunc = (quartal, key, value) => {
        setQuartalValues((array) => {
            let newArray = array.map((el: QuartalValuesType) => {
                if (el.nextDayQuartal == quartal) {
                    el[key] = value;
                    
                }

                return el;
            })
            return newArray;
        })
    }
    return (
        <div className={`dr-table__cells-container dr-table__row ${isVisible ? "" : "d-none"}`}>
            <div className='dr-table__cell dr-table__cell-employee'>
                <EmployeeCell employee={responsible}/>
            </div>

            <div className='dr-table__cell'>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect width="40" height="40" fill="url(#pattern0_3981_159937)"/>
                    <defs>
                    <pattern id="pattern0_3981_159937" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_3981_159937" transform="scale(0.0111111)"/>
                    </pattern>
                    <image id="image0_3981_159937" width="90" height="90" xlinkHref="data:image/png;base64,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"/>
                    </defs>
                </svg>
            </div>

            <div className='dr-table__cell'>
                {responsible.cntComplexity??0}/10
            </div>

            <div className='dr-table__cell'>
                <ComplexityInQuartalCell login={responsible.login??""} {...quartalValues[0]} changeValuesFunc={changeQuartalValue}/>
            </div>

            <div className='dr-table__cell'>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect width="40" height="40" fill="url(#pattern0_3981_159937)"/>
                    <defs>
                    <pattern id="pattern0_3981_159937" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_3981_159937" transform="scale(0.0111111)"/>
                    </pattern>
                    <image id="image0_3981_159937" width="90" height="90" xlinkHref="data:image/png;base64,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"/>
                    </defs>
                </svg>
            </div>

            <div className='dr-table__cell'>
                <ComplexityInQuartalCell login={responsible.login??""} {...quartalValues[1]} changeValuesFunc={changeQuartalValue}/>
            </div>

            <div className='dr-table__cell'>
                <ComplexityInQuartalCell login={responsible.login??""} {...quartalValues[2]} changeValuesFunc={changeQuartalValue}/>
            </div>

            <div className='dr-table__cell'>
                <ComplexityInQuartalCell login={responsible.login??""} {...quartalValues[3]} changeValuesFunc={changeQuartalValue}/>
            </div>

        </div>
    )
}