import { Button } from '@/shared/ui/Button';

type CloseModalBtnPropsType = {
    className?: string | null,
    closeFunc?: Function
}

export const CloseModalBtn = ({className = null, closeFunc = () => {}}: CloseModalBtnPropsType) => {
    return (
        <Button color='light' onClick={() => closeFunc()} className={`pt-0 ${className}`} size='sm' title='Закрыть модальное окно'>
            <i className="ri-close-fill fs-24"></i>
        </Button>
    )
}