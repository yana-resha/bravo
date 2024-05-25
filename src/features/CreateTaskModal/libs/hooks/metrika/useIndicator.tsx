import { useEffect, useState } from "react";
import { SelectStrategyItemType } from "../../../types/SelectStrategyDataTypes";
import { getStrategyList } from "@/pages/OKRPage/api/strategyAPI";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { useSelector } from "react-redux";
import { showInfoAlert } from "@/shared/utils/showInfoAlert";
import { IndicatorValuesType } from "../../../types/IndicatorValuesType";
import { TaskType } from "@/features/CreateTaskModal/types/TaskType";
import strategyMetricaServiceAPI from "@/entities/strategyMetrica/services/StrategyMetricaApIService";


export function useIndicator(taskType:TaskType|null) {

    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [indicatorItems, setIndicatorItems] = useState<SelectStrategyItemType[] | []>([]);
    const [indicatorValues, setIndicatorValues] = useState<IndicatorValuesType[]>([]);
    const [indicatorListLoading, setIndicatorListLoading] = useState<boolean>(false);
    const [indicatorInvalid, setIndicatorInvalid] = useState<false | string>(false);
    const [strategyMetricaItems, setStrategyMetricaItems] = useState<SelectStrategyItemType[]>([]);
    const [strategyItems, setStrategyItems] = useState<SelectStrategyItemType[]>([]);

    useEffect(() => {
        indicatorValues.length > 0 ? setIndicatorInvalid(false) : setIndicatorInvalid('Данное поле обязательно для заполнения');
    }, [indicatorValues]);

    const getStrategyItems = async () => {
        const request = {
            login: currentUser.login,
            shortList: true,
        }
        let strategyList: SelectStrategyItemType[] | [] = await getStrategyList(request);
        if (strategyList) {
            strategyList  = strategyList.map(el => {
                el.groupId = 1;
                return el;
            });

            setStrategyItems(strategyList);
            
        }
    }

    const getStrategyMetricItems = async () => {
        const request = {
            login: currentUser.login,
            shortList: true,
        }

        let strategyMetricList: SelectStrategyItemType[] = await strategyMetricaServiceAPI.readStrategyMetricList(request);
            if (strategyMetricList) {
                strategyMetricList = strategyMetricList.map(el => {
                    el.groupId = 2;
                    return el;
                });
                
                setStrategyMetricaItems(strategyMetricList);
            }
    }

    const getItems = async () => {
        setStrategyMetricaItems([]);
        setStrategyItems([]);
        if (taskType?.label == 'Метрика') {
            try {
                setIndicatorListLoading(true);
                let list = await getStrategyMetricItems();
            } catch(error) {
                console.log(error);
                showInfoAlert({
                    format : 'full', 
                    text: 'Ошибка загрузки списка стратегических метрик привязки к показателю', 
                    type: 'error',
                });
            } finally {
                setIndicatorListLoading(false);
            }
        }

        try {
            setIndicatorListLoading(true);
            let list = await getStrategyItems();
        } catch(error) {
            console.log(error);
            showInfoAlert({
                format : 'full', 
                text: 'Ошибка загрузки списка привязки к показателю', 
                type: 'error',
            });
        } finally {
            setIndicatorListLoading(false);
        }
    };

    useEffect(() => {
        setIndicatorItems([...strategyItems, ...strategyMetricaItems]);
       
    }, [strategyItems, strategyMetricaItems])

    const changeIndicatorValues = (item : IndicatorValuesType ) => {
        
        setIndicatorValues((prevState) => {
            let newArr = [...prevState.filter(el => el.index !== item.index)];
            if (item?.type) {
                newArr.push(item);
            }
            
            return newArr;
        });
    }

    useEffect(() => {
        if (taskType && (taskType.label == 'Метрика' || taskType.label == 'Стратегическая метрика')) {
            setIndicatorValues([]);
            getItems();
        }
    }, [taskType]);

    return {
        indicatorInvalid,
        indicatorItems, 
        indicatorValues, 
        changeIndicatorValues,
        indicatorListLoading,
    }
}