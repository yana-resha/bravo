import { useEffect } from "react";
import {Spinner } from "react-bootstrap";
import {useCurrentTasks} from "@/entities/task/libs/hooks/useCurrentTasks";
import { ChildTaskItem } from "@/widgets/OKRList/ui/ChildTaskItem/ChildTaskItem";
import { useSelector } from "react-redux";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";

type PropsType = {
    parentId: string,
    closeCollapse?: boolean,
    changeCloseCollapse?: (value: boolean) => void;
    namePadding?: number,
    viewTable?: boolean,
}

export function OKRSubTasks ({parentId,  closeCollapse, changeCloseCollapse = () => {}, namePadding = 5, viewTable = false} : PropsType) {
    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);
    const { 
        setLoadTasks, // установить значение что нужно загрузить kr задачи
        isLoadingTasklist, //лоадер
        errorTaskList, // ошибка загрузки
        tasksList, // список взятый из redux и  отфильтрованный по id родительской задачи
    } = useCurrentTasks(parentId, currentUser.login);

    const nameCellPadding = 15 + namePadding;
    
    useEffect(() => {
        setLoadTasks(true);
        changeCloseCollapse(false);
    }, []);
    
    return (
        <>
            <div className={`pt-2 pb-2`}>
                {tasksList?.length === 0 && !errorTaskList && !isLoadingTasklist && (
                    <div
                        style={{
                            backgroundColor: '#F4F4F4',
                            marginLeft: nameCellPadding,
                            // borderRadius: '14px',
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
                        <div className='fw-bold fs-12 mt-1'>Обновляем список KR - Задач...</div>
                    </div>
                )}

                {tasksList && !isLoadingTasklist && !errorTaskList &&
                    tasksList.map(KR => {
                        return (
                            
                            <ChildTaskItem
                                viewTable={viewTable}
                                namePadding={nameCellPadding}
                                closeCollapse={closeCollapse}
                                key={KR.id}
                                changeCloseCollapse={changeCloseCollapse}
                                {...KR}
                            >
                                <OKRSubTasks
                                    key={KR.id}
                                    namePadding={nameCellPadding + 5}
                                    parentId={KR.id}
                                    changeCloseCollapse={changeCloseCollapse}
                                    closeCollapse={closeCollapse}
                                />
                            </ChildTaskItem>
                            
                            
                        )
                    })
                }
            </div>
        </>
    )
}
