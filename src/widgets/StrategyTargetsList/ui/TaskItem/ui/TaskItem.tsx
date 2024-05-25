/* Hooks */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/* Components */
import { Collapse, Dropdown } from 'react-bootstrap';
import { StarList } from '@/shared/ui/StarList';
import { CustomProgressBar } from '@/shared/ui/CustomProgressBar';
import { CustomDropdownToggle } from '@/shared/ui/CustomDropdownToggle';
import { ArrowBtn } from '@/shared/ui/ArrowBtn';
import { AvatarGroup } from '@/shared/ui/Avatar'; 
import { Alert, Spinner } from 'react-bootstrap';

/* Types */
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';

/* Styles */
import cl from "./TaskItem.module.scss";

/* Icons */
import ElephantSVG from '@/shared/ui/svg/ElephantSVG/ElephantSVG';
import SnailSVG from '@/shared/ui/svg/SnailSVG/SnailSVG';
import { IconKebab } from '@consta/icons/IconKebab';

/* Images */
import defaulAvatar from "@/shared/assets/img/users/default-avatar.png";
import taskService from '@/entities/task/services/TaskService';



export function TaskItem({ ...item }: OKRItemType) {
    console.log(item);

    const currentUser = useSelector((state: StoreReducerType) => state?.userData?.user);

    const [showCollapse, setShowCollapse] = useState(false);
    const [listChildTasks, setListChildTasks] = useState<any>([]);

    const [isLoading, setLoading] = useState<boolean>(false);
    const [errorLoad, setErrorLoad] =useState<string | false>(false);

    const collapseChildTaskList = async () => {
        setLoading(true);

        const request = {
            login: currentUser.login,
            idParent: item.id
        }

        let childTasks;
        try {
            childTasks = await taskService.getListByParent(request);
            setListChildTasks(childTasks);
        } catch (error: any) {
            setErrorLoad(error.message || '');
        } finally {
            setLoading(false);
        } 
    }

    useEffect(() => {
        if (showCollapse) {
            collapseChildTaskList();
        }
    }, [showCollapse]);

    return (
        <div className={`taskItem ${cl.item}`}>
            <div className={`taskItem__visiblePart ${cl.visiblePart}`}>
                <div className='taskItem__mainPart'>
                    <div className={cl.taskType}>{ item.taskType }</div>
                    <div className={cl.titleRow}>
                        <span className={cl.title}>{ item.title }</span>
                        <StarList value={Number(item.complexity)} status='success' />
                    </div>
                    <div className='mb-2'>
                        <div className={cl.progressContainer}>
                            <CustomProgressBar
                                completed={item.progress ? Number(item.progress) : 0}
                                showLabel={true}
                                subfix='%'
                                maxCompleted={100}
                                status='success'
                                height='17px'
                            />
                        </div>
                    </div>
                    <div className={cl.responsible}>
                        {Array.isArray(item.responsibles) && (
                            <AvatarGroup items={item.responsibles} maxLength={5}/>
                        )}
                    </div>
                </div>

                <div className={`taskItem__controlsPart ${cl.actionBlock}`}>
                    {item.createLogin === currentUser.login && (
                        <Dropdown align={'start'} className='me-2'>
                            <CustomDropdownToggle>
                                <button className='btn btn-light btn-sm rounded-circle d-flex'>
                                    <IconKebab size="m" />
                                </button>
                            </CustomDropdownToggle>

                            <Dropdown.Menu className='end-0'>
                                <Dropdown.Item>Изменить</Dropdown.Item>
                                <Dropdown.Item>Удалить</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                    <ArrowBtn state={showCollapse} toggleFunc={() => setShowCollapse(!showCollapse)} size='l' />
                </div>
            </div>
            <Collapse in={showCollapse}>
                <div>        
                    {isLoading && (
                        <div className='d-flex flex-column align-items-center justify-content-center p-3'>
                            <Spinner animation="border" variant="primary" />
                            <div className='fw-bold fs-12 mt-1'>Загружаем список задач...</div>
                        </div>
                    )}

                    {errorLoad && (
                        <Alert 
                            className='d-flex justify-content-center'
                            variant={'danger'}
                        >
                            {errorLoad}
                        </Alert>
                    )}

                    {!errorLoad && (!listChildTasks || !listChildTasks.length) && (
                        <Alert 
                            className='d-flex justify-content-center'
                            variant={'primary'}
                        >
                            Список пуст
                        </Alert>
                    )}

                    {listChildTasks && listChildTasks.map((task: OKRItemType) => {
                        return <TaskItem {...task} />
                    })}
                </div>
            </Collapse>
        </div>
    )
}