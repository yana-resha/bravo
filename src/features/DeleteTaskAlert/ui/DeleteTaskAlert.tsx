import { showInfoAlert } from "@/shared/utils/showInfoAlert";
import { deleteOKR } from "@/entities/task/api/okrAPI";
import cl from './DeleteTaskAlert.module.scss';
import { removeOKRTask } from "@/entities/task/model/slices/okrListSlice";
import { useDispatch, useSelector } from "react-redux";
import { KRItemType } from "@/entities/task/types/KRItemType";
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import { MetricaItemType } from "@/entities/metrica/types/MetricaItemType";
import { StrategyMetricaItemType } from "@/entities/strategyMetrica/types/StrategyMetricaItemType";
import { deleteKR } from "@/entities/task/api/krAPI";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { removeChildTask } from "@/entities/task/model/slices/childTaskSlice";
import { removeStrategyMetric } from "@/widgets/MetricList/model/slices/StrategicMetricSlice";
import { removeMetric } from "@/widgets/MetricList/model/slices/MetricListSlice";
import { IStrategyTarget } from "@/entities/StrategyTarget";
import strategyApiService from "@/entities/StrategyTarget/services/StrategyApiService";
import { deleteStrategyTarget } from "@/entities/StrategyTarget/model/slices/strategyTargetSlice";
import metricaApiService from "@/entities/metrica/services/MetricaApiService";
import strategyMetricaServiceAPI from "@/entities/strategyMetrica/services/StrategyMetricaApIService";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { motion } from "framer-motion";

type props = {
    id: string,
    taskType: KRItemType['taskType'] | OKRItemType['taskType'] | MetricaItemType['taskType'] | StrategyMetricaItemType['taskType'] | IStrategyTarget['taskType'],
    isChild?: boolean,
    setCloseAlert: () => void;
}

export function DeleteTaskAlert({id, taskType, isChild = false, setCloseAlert}: props) {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const dispatch = useDispatch();

    const handleConfirm = async () => {
        try {
          let response;
          let request = {id, login: currentUser.login};
          if (taskType == 'OKR') {
            response = await deleteOKR(request)
          } else if (taskType == 'KR') {
            response = await deleteKR(request);
          } else if (taskType == 'strategyMetric') {
            response = await strategyMetricaServiceAPI.deleteStrategyMetrica(request)
          } else if (taskType == 'metric') {
            response = await metricaApiService.deleteMetrica(request)
          } else if (taskType == 'strategy') {
            response = await strategyApiService.deleteIStrategy(request);
          }

          if (response) {
            if (isChild && (taskType == 'KR' || taskType == 'OKR')) {
                dispatch(removeChildTask(id));
            } else if ((taskType == 'OKR' || taskType == 'KR') && !isChild) {
                dispatch(removeOKRTask(id));
            } else if (taskType == 'strategyMetric') {
              dispatch(removeStrategyMetric(id));
            } else if (taskType == 'metric') {
              dispatch(removeMetric(id));
            } else if (taskType == 'strategy') {
              dispatch(deleteStrategyTarget(id));
            }
            
            showInfoAlert({
              format: 'mini',
              type: 'success',
              text: 'Задача успешно удалена!'
            });
          }
        } catch (error:any) {
          showInfoAlert({
            format: 'mini',
            type: 'error',
            text: `${error.message}. Попробуйте еще раз`
          });
        }

        setCloseAlert();
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

          <motion.div
            initial={{ scale: 0 }}
            animate={{ rotate: 180, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >

            <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" width={88} height={88} fill="#f27474">
              <path d="M64,0a64,64,0,1,0,64,64A64.07,64.07,0,0,0,64,0Zm0,122a58,58,0,1,1,58-58A58.07,58.07,0,0,1,64,122Z"/>
              <path d="M92.12,35.79a3,3,0,0,0-4.24,0L64,59.75l-23.87-24A3,3,0,0,0,35.88,40L59.76,64,35.88,88a3,3,0,0,0,4.25,4.24L64,68.25l23.88,24A3,3,0,0,0,92.13,88L68.24,64,92.13,40A3,3,0,0,0,92.12,35.79Z"/>
            </svg>


          </motion.div>
          
          <span className={cl.dialogText}>Вы уверенны что хотите удалить задачу c id {id}?</span>
        </DialogTitle>
        <DialogActions sx={{
          justifyContent: 'center',
          paddingBottom: '25px'
        }}>
          <button className={cl.confirmButton} onClick={handleConfirm}>Да, удалить</button>
          <button className={cl.closeButton} onClick={setCloseAlert} autoFocus>Нет, отменить</button>
        </DialogActions>
      </Dialog>
    )
}