import { useEffect, useState } from "react"
import { ModalPropsType } from "../../types/ModalPropsType"
import { IStrategyTarget } from "@/entities/StrategyTarget";
import { useSelector } from "react-redux";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { showInfoAlert } from "@/shared/utils/showInfoAlert";
import strategyApiService from "@/entities/StrategyTarget/services/StrategyApiService";


type EditDataProps = {
    modalType: ModalPropsType['typeModal'],
    taskID?: ModalPropsType['taskID'] | null,
}

export function useEditData ({modalType, taskID = null} : EditDataProps) {

    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [editData, setEditData] = useState<false | IStrategyTarget>(false);
    const [editDataLoading, setEditDataLoading] = useState<boolean>(false);
    const [editDataError, setEditDataError] = useState<string | false>(false);

    const getEditData = async () => {
        setEditData(false);
        setEditDataLoading(true);
        setEditDataError(false);
        const request: any = {
            login: currentUser.login,
            id: taskID??""
        }

        try {
            let response = await strategyApiService.readIStrategy(request);
            if (response) {
                setEditData(response);  
            }
        } catch (error: any) {
            setEditDataError(error.message);
            showInfoAlert({
                type: 'error',
                text: error.message,
                format: 'full',
            });
        } finally {
            setEditDataLoading(false);
        }
    }

    useEffect(() => {
        if (modalType == 'edit' && taskID) {
            getEditData();
        }
    }, [modalType])

    return {
        editData, editDataLoading, editDataError,
    }
}