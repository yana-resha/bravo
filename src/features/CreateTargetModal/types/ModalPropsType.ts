export type ModalPropsType = {
    closeFunc: () => void;
    typeModal?: 'create' | 'edit',
    taskID?: string,
}