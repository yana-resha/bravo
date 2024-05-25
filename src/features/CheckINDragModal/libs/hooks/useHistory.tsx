import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import CheckinAPIService from "@/entities/checkIn/services/CheckinAPIService";
import { CheckinItemType } from "@/entities/checkIn/types/CheckinType";
import { OKRItemTypeShort } from "@/entities/task/types/OKRItemType";
import { showInfoAlert } from "@/shared/utils/showInfoAlert";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type props = {
    currentTaskID: string | null,
}

export function useHistory({currentTaskID} : props) {

    const [currentData, setCurrentData] = useState<CheckinItemType | null | undefined>(null);
    const [isLoadNewCheckin, setIsLoadNewCheckin] = useState<boolean>(false);
    const [historyList, setHistoryList] = useState<CheckinItemType[]>([]);
    const [historiesLength, setHistoriesLength] = useState<number>(0); 
    const listLimit = 3;
    const [historyListLoading, setHistoryLoading]  = useState<boolean>(false);
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const currentWeek = `${moment().format('YYYY')}-${moment().week() < 10 ? '0' + moment().week() : moment().week()}`;
    const [historyReloading, setHistoryReloading] = useState(false);


    const getNewCheckinsList = async () => {
        let request = {
            login: currentUser.login, 
            idTask: currentTaskID??"",
            limit: listLimit,
            start: 0, 
            
        }
        setHistoryLoading(true);
        setHistoryList([]);
        setCurrentData(null);

        try {

            let response = await CheckinAPIService.readCheckIN(request)
            if (response) {
                setHistoryList(response.list);
                setHistoriesLength(response.count - response.list.length);
                if (response.list.length > 0) {
                    if (response.list[0].ciDate && currentWeek == response.list[0].ciDate) {
                        setCurrentData(response.list[0]);
                    } else {
                        setCurrentData(undefined);
                    }
                }
            }
        } catch(error: any) {

            showInfoAlert({
                type: 'error',
                text: error.message,
                format: 'full',
            });

        } finally {
            setHistoryLoading(false);
            
        }

    };

    const getReloadCheckinList = async () => {
        setHistoryReloading(true);
        let request = {
            login: currentUser.login, 
            idTask: currentTaskID??"",
            limit: listLimit,
            start: historyList.length, 
        }

        try {
            let response = await CheckinAPIService.readCheckIN(request);
            if (response) {
                setHistoryList(prevList => {
                    let newList = [...prevList, ...response.list];
                    setHistoriesLength(response.count - newList.length);
                    return newList;
                });
                
                
            }

        } catch(error: any) {

            showInfoAlert({
                type: 'error',
                text: `Не удалось загрузить историю <br>${error.message}`,
                format: 'full',
            });

        } finally {
            setHistoryReloading(false);
        }
    }

    const addNewCheckIN =  (newValue: CheckinItemType) => {
        setCurrentData(newValue);
        historyList.unshift(newValue);
    }

    const changeCheckIN =  (newValue: CheckinItemType) => {
        setHistoryList(preValue => {
            let newList = preValue.map((el, index) => {
                if (el.id == newValue.id) {
                    el = newValue;
                    setCurrentData(newValue);
                }
                
                return el;
            });
            return newList;
        })
    }

    useEffect(() => {
        if (!currentTaskID) {
            setHistoryList([]);
            setHistoriesLength(0);
            setCurrentData(null);
        } else {
            getNewCheckinsList();
        }
    }, [currentTaskID])

    return {
        historyList, historyListLoading, historiesLength, currentData, addNewCheckIN, changeCheckIN, historyReloading, getReloadCheckinList,
    }
}