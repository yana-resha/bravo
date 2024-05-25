export type SelectStrategyItemType = {
    title: string;
    id: string | number;
    groupId?: string | number;
    index?: string | number | false,
    taskType?: SelectStrategyGroupType['type'],
    
};
  
export  type SelectStrategyGroupType = {
    label: string;
    id: string | number;
    type: string,
  };