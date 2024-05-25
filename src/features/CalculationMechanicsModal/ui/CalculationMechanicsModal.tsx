import { Form, Modal } from 'react-bootstrap';
import cl from './CalculationMechanicsModal.module.scss';
import { Button } from '@/shared/ui/Button';
import Rating from '@mui/material/Rating';
import { TextareaAutosize } from '@mui/material';
import { DatePicker } from '@consta/uikit/DatePicker';
import { IconCalendar } from '@consta/icons/IconCalendar';

type ModalProps = {
    closeFunc: () => void;
}

export function CalculationMechanicsModal({closeFunc} : ModalProps) {

    return (
        <Modal   
            backdrop="static"
            className=""
            show={true}
            onHide={closeFunc}
            centered
            dialogClassName={cl.taskModalDialog}
            contentClassName={`${cl.taskModal}`}
            scrollable={true}
        >
            <div className='d-flex flex-row justify-content-between mb-3'>
                <div className={cl.modalTitle}>Механика расчета выполнения задачи</div>
                <Button color='light' onClick={closeFunc} className='pt-0 pb-0' size='sm' title='Закрыть модальное окно'>
                    <i className="ri-close-fill fs-24"></i>
                </Button>
            </div>

            <Modal.Body>
                <div className={cl.intro}>
                    <div className={cl.indicator}>P</div>
                    <Form.Check
                        type="switch"
                        checked={true}
                    />
                    <div className={cl.indicator}>A</div>
                </div>

                <div className={cl.descriptions}>
                    <div className={cl.description}>
                        <div className={cl.indicator}>P</div>
                        <div className={cl.descriptionText}>
                            Ручной режим - процент выполнения задачи (прогресс) формируется исходя из самодекларации при Check-in. По умолчанию установлен ручной режим
                        </div>
                    </div>
                    <div className={cl.description}>
                        <div className={cl.indicator}>A</div>
                        <div className={cl.descriptionText}>
                            Автоматических режим - процент выполнения задачи (прогресс) формируется исходя прогресса выполнения дочерних задач с учетом их веса
                        </div>
                    </div>
                </div>

            </Modal.Body>

            <div className={cl.footer}>
                <div></div>
                <div>
                    <Button color="primary" className={`${cl.footerBtn} ${cl.submitBtn}`} onClick={closeFunc}>Понятно</Button>
                </div>
            </div>


        </Modal>
    )
}
