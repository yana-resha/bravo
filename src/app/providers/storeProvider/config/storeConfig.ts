import { Reducer, configureStore } from '@reduxjs/toolkit';

/* Types */
import { UserStateType } from '@/entities/user/types/userTypes';

/* Slices */
import userDataReducer from '../../../model/slices/userSlice';
import okrListSlice from '@/entities/task/model/slices/okrListSlice';
import childTaskSlice from '@/entities/task/model/slices/childTaskSlice';
import strategyMetricReducer from '../../../../widgets/MetricList/model/slices/StrategicMetricSlice';
import GuidingPurposeSlice from '@/entities/guidingPurpose/model/slices/guidingPurposeSlice';
import MetricListSlice from '@/widgets/MetricList/model/slices/MetricListSlice';
import strategyTargetSlice from '@/entities/StrategyTarget/model/slices/strategyTargetSlice';
import priorityTaskSlice from '@/entities/task/model/slices/priorityTaskSlice';
import checkinSlice from '@/entities/checkIn/model/slices/checkinSlice';
import SpecialSuccessSlice from '@/entities/specialSuccess/model/slices/SpecialSuccessSlice';
import approvalsSlice from '@/entities/request/model/slices/approvalsSlice';

export type StoreReducerType = {
  userData: any,
  okrList: any,
  strategyMetric: any,
  metricList: any,
  strategyTarget: any,
  guidingPurpose: any,
  childTaskList: any,
  priorityTaskList: any,
  checkinData: any,
  specialSuccess: any,
  approvalsList: any
}

const reducer: StoreReducerType = {
  userData: userDataReducer,
  okrList: okrListSlice,
  metricList: MetricListSlice,
  childTaskList: childTaskSlice,
  strategyMetric: strategyMetricReducer,
  strategyTarget: strategyTargetSlice,
  guidingPurpose: GuidingPurposeSlice,
  priorityTaskList: priorityTaskSlice,
  checkinData: checkinSlice,
  specialSuccess: SpecialSuccessSlice,
  approvalsList: approvalsSlice
};

export const store = configureStore({
    reducer,
});
