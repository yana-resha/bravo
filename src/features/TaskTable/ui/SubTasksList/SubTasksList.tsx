import { useEffect } from "react";
import {Spinner } from "react-bootstrap";
import {useCurrentTasks} from "@/entities/task/libs/hooks/useCurrentTasks";
import { useSelector } from "react-redux";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import ChildTaskItem from "@/features/TaskTable/ui/ChildTaskItem";
import { TaskTableColumns } from "../../types";


type PropsType = {
    parentId: string,
    closeCollapse?: boolean,
    changeCloseCollapse?: (value: boolean) => void;
    namePadding?: number,
    viewTable?: boolean,
    rowConfig: TaskTableColumns[],
    filterList?: string[],
    applied?: boolean,
}

export function SubTasksList ({filterList = undefined, applied = false, parentId,  closeCollapse, changeCloseCollapse = () => {}, namePadding = 5, viewTable = false, rowConfig} : PropsType) {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);

    const { 
        setLoadTasks, // установить значение что нужно загрузить kr задачи
        isLoadingTasklist, //лоадер
        errorTaskList, // ошибка загрузки
        tasksList, // список взятый из redux и  отфильтрованный по id родительской задачи
    } = useCurrentTasks(parentId, currentUser.login);

    const nameCellPadding = 15 + namePadding;
    
    useEffect(() => {
        // setLoadTasks(true);
        changeCloseCollapse(false);
    }, []);

    // Не использовать лоадер
    
    return (
        <>
            <div className={`pb-2`}>
                {tasksList?.length === 0 && !errorTaskList && !isLoadingTasklist && (
                    <div
                        style={{
                            backgroundColor: '#F4F4F4',
                            marginLeft: nameCellPadding,
                            padding: '15px',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'black',
                        }}
                    >
                        Нет привязанных подзадач
                    </div>
                )}

                {errorTaskList && (
                    <div
                        style={{
                            backgroundColor: '#E4B5C3',
                            marginLeft: nameCellPadding,
                            // borderRadius: '14px',
                            padding: '15px',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'black',
                        }}
                    >
                        Произошла ошибка: {errorTaskList}
                    </div>
                )}

                {isLoadingTasklist && (
                    <div
                        className='d-flex flex-column align-items-center justify-content-center'
                        style={{
                            backgroundColor: '#F4F4F4',
                            marginLeft: nameCellPadding,
                            // borderRadius: '14px',
                            padding: '15px',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'black',
                        }}
                    >
                        <Spinner size='sm' animation="border" variant="primary" />
                        <div className='fw-bold fs-12 mt-1'>Загружаем список задач</div>
                    </div>
                )}

                {applied && tasksList.length > 0 && tasksList.every(item => filterList?.every(id => id !== item.id)) && !isLoadingTasklist && !errorTaskList && (
                    <div
                    style={{
                        backgroundColor: '#F4F4F4',
                        marginLeft: nameCellPadding,
                        padding: '15px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'black',
                    }}
                    >
                        По выбранным фильтрам нет подзадач
                    </div> 
                )}

                {tasksList && !isLoadingTasklist && !errorTaskList &&
                    tasksList.map(KR => {
                        let isVisible = true;
                        if (filterList?.every((i: any) => i !== KR.id)) isVisible = false;
                        return (   
                            <ChildTaskItem
                                viewTable={viewTable}
                                namePadding={nameCellPadding}
                                closeCollapse={closeCollapse}
                                key={KR.id}
                                isVisible={isVisible}
                                changeCloseCollapse={changeCloseCollapse}
                                rowConfig={rowConfig}
                                {...KR}
                            >
                                <SubTasksList
                                    key={KR.id}
                                    namePadding={nameCellPadding + 5}
                                    parentId={KR.id}
                                    changeCloseCollapse={changeCloseCollapse}
                                    closeCollapse={closeCollapse}
                                    rowConfig={rowConfig}
                                />
                            </ChildTaskItem>
                        )
                    })
                }
            </div>
        </>
    )
}
