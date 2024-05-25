import { Button } from "@/shared/ui/Button/ui/Button";
import { Form } from "react-bootstrap";
import cl from './MetricValuesField.module.scss';
import { MetrikaPeriodType } from "../../types/MetrikaPeriodType";
import { useEffect, useState } from "react";
import { ValuesRow } from "./ValuesRow";
import { MetricValuesType } from "../../types/MetricValues";
import { UnitType } from "../../data/metrika/unitItems";
import { InvalidInputText } from "@/shared/ui/InvalidInputText";

type MetricValuesFieldPropsType = {
    period : MetrikaPeriodType | null,
    metricValues: MetricValuesType[],
    setMetricValues: (value: any) => any;
    unit?:UnitType | null,
    defaultValues?: MetricValuesType [],
    
}


export function MetricValuesField({ defaultValues = [], period, metricValues, setMetricValues, unit=null} : MetricValuesFieldPropsType) {
    const [fields, setFields] = useState<any[]>([]);

    const handlerChangeMetricValues = (value: MetricValuesType) => {
        setMetricValues((prev: any) =>{
            let newArr = [...prev.filter((el: any) => el.index !== value.index)];
            if (value.plan) {
                newArr.push(value);
            }
            return newArr;
        });
    }
    useEffect(() => {
        setMetricValues([]);
    }, [period]);

    useEffect(() => {
        if (defaultValues && defaultValues.length > 1) {
            defaultValues.forEach((el, index) => {
                if (index > 0) {
                    addRow(el);
                }
            });
        }
    }, [defaultValues]);

    const addRow = (defaultValue: MetricValuesType | null = null) => {
        setFields(prevFields => {
            return [...prevFields, {
                [Math.floor(Math.random() * 1000) + 1] : true,
                defaultValue: defaultValue,
            }]
        });
    }
    const deleteRow = (index : string | number) => {
        setFields(prevFields => {
            let currentArr = prevFields;
            currentArr = currentArr.map(el => {
                if (el[index]) {
                    el[index] = false;
                }
                return el;
            });

            return currentArr;
        })
    }

    return (
        <div>
            <div>
                <div className={`${cl.lastRow}`}>
                    <Form.Label className={cl.label}>
                        Плановые показатели метрики
                    </Form.Label>

                    <Form.Label className={cl.label}>
                        Значение
                    </Form.Label>
                </div>
                <ValuesRow period={period} 
                key={'k'}
                changeFunc={handlerChangeMetricValues} 
                unit={unit}
                defaultValue={defaultValues && defaultValues.length > 0 ? defaultValues[0] : null}
                />
                
                {fields.map(el => {
                    let show = Object.values(el)[0];
                    if (show) {
                        return <ValuesRow 
                        period={period} 
                        index={Object.keys(el)[0]} 
                        changeFunc={handlerChangeMetricValues}
                        closeBtn={true}
                        closeFunc={deleteRow}
                        unit={unit}
                        key={Object.keys(el)[0]}
                        defaultValue={el.defaultValue}
                        />
                    } else {
                        return <></>
                    }
                })}
            </div>
            <Button color='clear' className={cl.addPeriodBtn} onClick={() => addRow(null)}>
                <i className="bx bx-plus me-1" ></i>
                Добавить период
            </Button>
        </div>
    )
}