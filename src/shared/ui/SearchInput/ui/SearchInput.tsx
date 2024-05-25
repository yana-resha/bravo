import { useEffect } from 'react';
import cl from './searchInput.module.scss';
import Form from 'react-bootstrap/Form';

type SearchInputProps = {
  value: string | number,
  changeFunc: (e :React.ChangeEvent<HTMLInputElement>) => void,
  className?: string,
  size?: 'lg' | 'sm',
  placeholder?: string,
  style?: React.CSSProperties,
}

export function SearchInput ({style = {},value, changeFunc, className = '', size, placeholder="Поиск..."} : SearchInputProps) {


    return (
      <div className="position-relative">
          <input 
            style={style}
            type="text" 
            value={value} 
            onChange={(e) => changeFunc(e)} 
            className={`form-control ${cl.searchInput} ${className}`} 
            placeholder={placeholder}
            >
          </input>
          <span className={`mdi mdi-magnify search-widget-icon ${cl.searchWidgetIcon}`}></span>
      </div>
    )
}


