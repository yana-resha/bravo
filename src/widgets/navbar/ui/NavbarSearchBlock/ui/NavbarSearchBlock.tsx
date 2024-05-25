import { useState } from 'react';
import { SearchInput } from '@/shared/ui/SearchInput';
import cl from './navbarSearchBlock.module.scss'




export function NavbarSearchBlock () {
    const [value, setValue] = useState('');

    function changeInputValue(event: React.ChangeEvent<HTMLInputElement>) {
      setValue(event.target.value)
    }
    
    return (

      <SearchInput value={value} className={cl.headerInput} changeFunc={changeInputValue} placeholder={'Поиск сотрудника или задачи'}/>

    )

}