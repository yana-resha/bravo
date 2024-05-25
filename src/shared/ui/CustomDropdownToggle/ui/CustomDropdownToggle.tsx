import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

type ToggleProps = {
  children: React.ReactNode,
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export function CustomDropdownToggle({children, onClick}: ToggleProps) {

    const CustomToggle = React.forwardRef(({ children, onClick }:any, ref) => (

      <div onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}>
        {children}
      </div>
    ));

  
    return (
      <Dropdown.Toggle as={CustomToggle}>
        {children}
      </Dropdown.Toggle>
    )
}
