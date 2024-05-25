
import cl from './QuartalSelectGroup.module.scss';
import './QuartalSelectGroup.scss'
import { FieldGroup } from '@consta/uikit/FieldGroup';
import { Select } from "@consta/uikit/Select";
import moment from 'moment';
import { useEffect, useState } from 'react';

const quartalData:SelectType[] = [
  {
    label: 'I квартал',
    id: '01-01'
  },
  {
    label: 'II квартал',
    id: '04-01'
  },
  {
    label: 'III квартал',
    id: '07-01'
  },
  {
    label: 'IV квартал',
    id: '10-01'
  },
]

type SelectType = {
  label: string,
  id: string,
}

type QurtalSelectPropsType = {
    setValue: (value: any) => void;
    clear?: boolean,
    className?: string,
    disabled?: boolean,
}

export function QuartalSelectGroup({setValue, clear, className="", disabled=false} : QurtalSelectPropsType) {

    const [yearItems, setYearItems] = useState<SelectType[]>([]);
    const [quartal, setQuartal] = useState<SelectType | null>(null);
    const [year, setYear] = useState<SelectType | null>(null);


    useEffect(() => {
      const items: SelectType[] = [];
      for (let i = 0; i < 5; ++i) {
        const year = moment().add(i, 'years').format('YYYY');
        const item: SelectType = {
          label: year,
          id: year,
        }
        items.push(item)
      }

      setYearItems(items);
    }, []);

    useEffect(() => {
      if (clear) {
        setQuartal(null);
        setYear(null);
        setValue(undefined);
      }
    }, [clear])

    useEffect(() => {
      if (year && quartal) {
        setValue(`${year.id}-${quartal.id}`);
      } else {
        setValue(undefined);
      }

    }, [year, quartal]);
    
    return (
      <FieldGroup size="l"
      className={`quartalSelectGroup ${disabled ? 'disabled' : ''} ${className}`}
      >
        <Select
          placeholder="Квартал"
          items={quartalData}
          value={quartal}
          
          onChange={(item: any) => {
            item ? setQuartal(item) : setQuartal(null)
          }}
          dropdownClassName={`${cl.dropdown} quartalSelectGroupDropdown`}
        />
        <Select
          
          placeholder="Год"
          items={yearItems}
          value={year}
          onChange={(item: any) => {
            item ? setYear(item) : setYear(null);
          }}
          dropdownClassName={`${cl.dropdown} quartalSelectGroupDropdown`}
        />
      </FieldGroup>
    )
}