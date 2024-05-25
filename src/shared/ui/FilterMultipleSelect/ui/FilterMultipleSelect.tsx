
import { Combobox } from '@consta/uikit/Combobox';
import cl from './filterMultipleSelect.module.scss';

export type FilterItem = {
    value: string;
    label: string,
    id: string,
}

export type FilterProps = {
    value: FilterItem[] | null;
    items: FilterItem[];
    setValue: (value : FilterItem[] | null) => void;
    className?: string;
}

export function FilterMultipleSelect({value, items, setValue, className = ''} : FilterProps) {
    return (
        <Combobox
            className={cl.filter}
            form="round"
            dropdownForm='round'
            required={true}
            placeholder="Выберите квартал"
            items={items}
            value={value}
            onChange={setValue}
            dropdownClassName='selectDropdown'
            size='s'
            multiple
        />
    )
}