type ProgressItem = ({
    type: 'metric';
    title: string;
    progress: number;
    
} | {
    type: 'task';
    title: string;
    status: 'по плану' | 'с опозданием' | 'под угрозой';
    complexity: number;
});

export type CurrentProgressData = ProgressItem[];
export type HistoryProgressData = ProgressItem[];