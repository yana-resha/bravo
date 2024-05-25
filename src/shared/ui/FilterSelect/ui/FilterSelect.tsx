import { Select} from '@consta/uikit/Select';
import cl from './filterSelect.module.scss';
import './filterSelect.scss';
import { useState } from 'react';

export type FilterSelectType = {
    label: string,
    id: string,
}

export type FilterProps = {
    value: FilterSelectType | null,
    items: FilterSelectType [],
    setValue: (value : FilterSelectType | null) => void | null,
    className?: string; 
}

export function FilterSelect({value, items, setValue, className = ''} : FilterProps) {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (


        <div className={`${cl.filterSelectBlock} filter-select ${className}`}>
            <Select
                form="round"
                placeholder="Выберите значение"
                className={`${cl.customSelect}`}
                required={true}
                items={items}
                value={value}
                onChange={setValue}
                dropdownClassName='selectDropdown'
                size='s'
                dropdownOpen={dropdownOpen}
                view='clear'
            />
        <span 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`las la-filter ${cl.searchWidgetIcon}`}
        >
            </span>
        </div>
    )
}