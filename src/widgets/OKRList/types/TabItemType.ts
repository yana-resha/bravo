export type TabItemType = {
    label: string,
    id: 'doneList' | 'cancelList' | 'inprogressList',
    count: number;
};