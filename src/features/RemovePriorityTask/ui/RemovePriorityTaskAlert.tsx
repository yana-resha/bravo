import { showInfoAlert } from "@/shared/utils/showInfoAlert";
import PriorityTaskService from "../../../entities/task/services/PriorityTaskService";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { alertPropsType } from "../types/alertPropsType";
import cl from './RemovePriorityTaskAlert.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { removeTask } from "@/entities/task/model/slices/priorityTaskSlice";

export function RemovePriorityTaskAlert({taskID, setCloseAlert}: alertPropsType) {
    const currentUser = useSelector((state: any) => state?.userData?.user);
    const dispatch = useDispatch(); 
    const priorityTaskService = new PriorityTaskService(taskID, currentUser.login);

    const handleConfirm = async () => {
        setCloseAlert();

        try {
            const result = await priorityTaskService.removeTaskFromPriority();
            if (!result) {
                throw new Error('Произошла ошибка при удалении задачи из списка приоритетных');
            }

            dispatch(removeTask(taskID));
        } catch (error: any) {
            console.error(error);
            showInfoAlert({
                format: 'mini',
                type: 'error',
                title: error.message
            });
        }
    }

    return (
        <Dialog
            open={true}
            onClose={setCloseAlert}
            aria-labelledby="alert-dialog-title"
            sx={{
                fontFamily: 'inherit',
                color: 'inherit'
            }}
        >
            <DialogTitle id="alert-dialog-title" sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '40px'
            }}>
                <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" width={88} height={88} fill="#f27474">
                    <path d="M64,0a64,64,0,1,0,64,64A64.07,64.07,0,0,0,64,0Zm0,122a58,58,0,1,1,58-58A58.07,58.07,0,0,1,64,122Z"/>
                    <path d="M92.12,35.79a3,3,0,0,0-4.24,0L64,59.75l-23.87-24A3,3,0,0,0,35.88,40L59.76,64,35.88,88a3,3,0,0,0,4.25,4.24L64,68.25l23.88,24A3,3,0,0,0,92.13,88L68.24,64,92.13,40A3,3,0,0,0,92.12,35.79Z"/>
                </svg>
                <span className={cl.dialogText}>Вы хотите убрать задачу из списка приоритетных?</span>
            </DialogTitle>
            <DialogActions sx={{
                justifyContent: 'center',
                paddingBottom: '25px'
            }}>
                <button className={cl.confirmButton} onClick={handleConfirm}>Да, убрать</button>
                <button className={cl.closeButton} onClick={setCloseAlert} autoFocus>Нет, отменить</button>
            </DialogActions>
        </Dialog>
    ); 
}