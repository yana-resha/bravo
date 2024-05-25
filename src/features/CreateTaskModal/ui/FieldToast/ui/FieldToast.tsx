import { useState } from 'react';
import cl from './fieldToast.module.scss';
import './fieldToast.scss';
import Toast from 'react-bootstrap/Toast';

type ToastType = {
  className?: string,
  theme?: 'primary' | 'danger' | 'warning',
  closeButton?: true | false;
  children: React.ReactNode | React.ReactElement | string,
}

const toastTheme = {
  'primary': cl.primary,
  'danger': cl.danger,
  'warning': cl.warning,
}

export function FieldToast ({className, theme, children, closeButton = true} : ToastType ) {

    const [show, setShow] = useState(true);

    

    return (
      <Toast
      show={show}
      onClose={() => setShow(false)}
      className={`${cl.toast} ${theme ? toastTheme[theme] : ''} ${className? className : ''}`}
      >

          <Toast.Header className={cl.toastHeader} closeButton={closeButton}>
              {children}
          </Toast.Header>
         

      </Toast>
    )
}
