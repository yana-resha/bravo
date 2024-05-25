import cl from './MetricValuesField.module.scss';
import { DatePicker } from "@consta/uikit/DatePicker";
import { Form } from "react-bootstrap";
import {IconCalendar} from '@consta/icons/IconCalendar';
import { MetrikaPeriodType } from "../../types/MetrikaPeriodType";
import { QuartalSelectGroup } from "@/shared/ui/QuartalSelectGroup";
import { memo, useEffect, useState } from "react";
import moment from 'moment';
import { Button } from '@/shared/ui/Button/ui/Button';
import { UnitType } from '../../data/metrika/unitItems';
import { InvalidInputText } from '@/shared/ui/InvalidInputText';
import { getFormattedNumber } from '@/shared/lib/getFormattedNumber';
import { ReactMaskOpts, useIMask } from 'react-imask';
import { TextField } from '@consta/uikit/TextField';
import { MetricValuesType } from '../../types/MetricValues';

type RowPropsType = {
    period : MetrikaPeriodType | null,
    index?: string | number,
    changeFunc: (value: fieldValueType) => void,
    closeBtn?: boolean
    closeFunc?: (index: string | number) => void,
    unit?:UnitType | null,
    defaultValue?: null | MetricValuesType,
}

type fieldValueType = {
    index?: string | boolean | number,
    plan?: string | null,
    quartal?: string | undefined | null,
    month?: string | undefined | null,
}


const TextFieldMemo = memo(TextField);
export function ValuesRow(props: RowPropsType) {
    const {period, index, changeFunc, closeBtn = false, closeFunc = () => {}, unit, defaultValue = null} = props
    const [date, setDate] = useState<string | undefined>(undefined);
    
    const { ref, value, setValue , unmaskedValue } = useIMask<HTMLInputElement,ReactMaskOpts>({
    mask: Number,
    min: -10000000,
    scale: 2,
    thousandsSeparator: ' ',
    radix: ',',
    padFractionalZeros: true,
    autofix: true,
    lazy: false,
    normalizeZeros: true,
    mapToRadix: ['.'],
  });


   
    useEffect(() => {
        setValue("");
    }, [unit]);

    useEffect(() => {
        if (defaultValue) {
            
            setDate(moment(defaultValue.month, 'DD.MM.YYYY').format('YYYY-MM-DD'));
            setValue(String(defaultValue.plan)??"");
        }

    }, [defaultValue])

    useEffect(() => {
        if (period) {
            if (defaultValue) {
                if (period.id == "Ежемесячно" && defaultValue.month) {
                    setDate(moment(defaultValue.month).format('YYYY-MM-DD'));
                    setValue(String(defaultValue.plan)??"");

                } else  {
                    
                    setDate(undefined);
                    setValue(String(defaultValue.plan)??"");
                }
            } else {
                setDate(undefined);
                setValue("");
            }

        } else {
            setDate(undefined);
            setValue("");

        }
        
    }, [period]);


   
    useEffect(() => {

        let newData : fieldValueType = {};
        newData.index = index??false;
        if ((unmaskedValue &&  Number(unmaskedValue) != 0) && date) {
            newData.plan = unmaskedValue && Number(unmaskedValue) != 0? unmaskedValue : null;
            if (period?.id =='Ежеквартально') newData.quartal = date;
            else if (period?.id == 'Ежемесячно')  newData.month = date;
        }
        changeFunc(newData);

    }, [unmaskedValue, date]);

   

    return (
        <div className={`${cl.lastRow} mb-3`}>
            {period?.id !== 'Ежемесячно' && (
                <QuartalSelectGroup
                    setValue={(value) => {
                        setDate(value);
                    }}
                />
            )}
            {period?.id == 'Ежемесячно' && date !== undefined && (
                <DatePicker
                    className='date-picker'
                    dropdownClassName={cl.pickerDropdown}
                    type="month"
                    value={new Date(date)}
                    onChange={(value) => {
                        const dateStr = value ? moment(value).format('YYYY-MM-DD') : undefined;
                        setDate(dateStr);
                    }}
                    placeholder={'Выберите месяц'}
                    rightSide={IconCalendar}
                    minDate={new Date()}
                    size='l'
                />
            )}

            {period?.id == 'Ежемесячно' && date == undefined && (
                <DatePicker
                    className='date-picker'
                    dropdownClassName={cl.pickerDropdown}
                    type="month"
                    value={undefined}
                    onChange={(value) => {
                        const dateStr = value ? moment(value).format('YYYY-MM-DD') : undefined;
                        setDate(dateStr);
                    }}
                    placeholder={'Выберите месяц'}
                    rightSide={IconCalendar}
                    minDate={new Date()}
                    size='l'
                />
            )}


            <div className='position-relative'>

                <TextFieldMemo
                  key={index}
                  defaultValue={undefined}
                  placeholder="Введите значение"
                  inputRef={ref}
                  size='l'
                  className={cl.modalInput}
                  disabled={unit?.id ? false : true}
                />

                {unit && <span className={cl.inputIcon}>{unit.icon}</span>}
                {!unit && (
                    <InvalidInputText className='ps-1 position-absolute w-100 top-100 start-0'>Чтобы поле разблокировалось выберите единицу измерения</InvalidInputText>
                )}
            </div>
           

            {
            closeBtn && (
                <div className='d-flex flex-row align-items-center'>
                    <Button
                      onClick={() => {
                        setDate(undefined);
                        setValue("");
                        changeFunc({index})
                        if (index) closeFunc(index);
                      }}
                      color="light"
                      borderRadius="circle"
                      size="sm"
                      className={cl.closeBtn}
                      >
                        <i className="ri-close-line"></i>
                    </Button>
                </div>
            )
          }
        </div>
    )
}