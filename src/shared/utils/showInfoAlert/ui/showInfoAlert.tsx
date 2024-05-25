import cl from './ShowInfoAlert.module.scss';
import { SnackbarKey, closeSnackbar, enqueueSnackbar } from 'notistack';

type PropsType = {
    format?: 'full' | 'mini',
    type?: "success" | 'info' | 'error' | 'warning',
    text?: string,
    title?: string,
}

export function showInfoAlert({ format, type = 'info', title="", text="" } : PropsType) {
    const Actions = (snackbarId: SnackbarKey) => (
        <button className={cl.hiddenButton} onClick={() => { closeSnackbar(snackbarId) }}>
            <span className='visually-hidden'>Скрыть уведомление</span>
            <i className="ri-close-fill" />
        </button>
    );

    enqueueSnackbar(text, {
        variant: type,
        action: Actions,
        autoHideDuration: 3000
    });
}
