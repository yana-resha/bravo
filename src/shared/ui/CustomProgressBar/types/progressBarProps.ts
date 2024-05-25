

export type ProgressBarProps = {
    withIcon?: boolean,
    status?: 'danger' | 'warning' | 'success',
    maxCompleted?: number,
    completed?: number,
    height?: string,
    borderRadius?: string,
    showLabel?: boolean,
    subfix?: string,
    passingScore?: number,
}