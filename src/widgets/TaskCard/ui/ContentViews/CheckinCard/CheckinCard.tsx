import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import checkinAPIService from '@/entities/checkIn/services/CheckinAPIService';
import { CheckinItemType } from '@/entities/checkIn/types/CheckinType';
import { Button } from '@/shared/ui/Button';
import CloseModalBtn from '@/shared/ui/CloseModalBtn';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { CheckinItem } from '../../CheckinItem/CheckinItem';

type CheckinProps = {
    isShow: boolean;
    task: OKRItemType;
    closeModalFunc: () => void;
    reloadList: boolean;
    setReloadList: () => void;
};

export function CheckinCard(props: CheckinProps) {
    const { isShow, task, closeModalFunc, reloadList, setReloadList } = props;

    const currentUser = useSelector((state: StoreReducerType) => state.userData.user);
    const checkinsLimit = 10;
    const [isLoadingCheckin, setIsLoading] = useState<boolean>(false);
    const [checkinItems, setCheckinItems] = useState<CheckinItemType[]>([]);
    const [loadError, setLoadError] = useState<boolean>(false);
    const [listCount, setListCount] = useState<number>(0);

    const getCheckin = async (startPosition: number = 0, limit: number = checkinsLimit) => {
        setIsLoading(true);
        setLoadError(false);
        try {
            const response = await checkinAPIService.readCheckIN({
                login: currentUser.login,
                idTask: task.id,
                start: startPosition,
                limit: limit,
            });
            setListCount(response.count);
            if (startPosition == 0) {
                setCheckinItems(response.list);
            } else {
                setCheckinItems((prev) => [...prev, ...response.list]);
            }
        } catch (error: any) {
            setLoadError(true);
        } finally {
            setIsLoading(false);
            setReloadList();
        }
    };

    useEffect(() => {
        if (reloadList) {
            getCheckin(0, checkinItems.length > 0 ? checkinItems.length : checkinsLimit);
        }
    }, [reloadList]);

    useEffect(() => {
        getCheckin();
    }, []);

    return (
        <>
            <AnimatePresence>
                <motion.div
                    className={`TaskCard__tab`}
                    animate={isShow ? 'show' : 'hide'}
                    transition={{ duration: 0.5 }}
                    initial={'hide'}
                    variants={{
                        show: {
                            x: 0,
                            opacity: 1,
                            display: 'block',
                        },

                        hide: {
                            x: -100,
                            opacity: 0,
                            display: 'none',
                        },
                    }}
                >
                    <div className="TaskCard__tabTitle">Check-in</div>
                    <div className="CheckinList__container">
                        <div className="CheckinList__list">
                            {checkinItems.length == 0 && !loadError && !isLoadingCheckin && (
                                <div
                                    style={{
                                        backgroundColor: '#F4F4F4',
                                        // marginLeft: nameCellPadding,
                                        borderRadius: '14px',
                                        padding: '15px',
                                        textAlign: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'black',
                                    }}
                                >
                                    Список CHECK-IN пуст
                                </div>
                            )}

                            {checkinItems.length == 0 && loadError && !isLoadingCheckin && (
                                <div
                                    style={{
                                        backgroundColor: '#E4B5C3',
                                        borderRadius: '14px',
                                        padding: '15px',
                                        textAlign: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'black',
                                    }}
                                >
                                    Произошла ошибка: не смогли загрузить данные с сервера
                                </div>
                            )}

                            {checkinItems.length == 0 && !loadError && isLoadingCheckin && (
                                <div
                                    className="d-flex flex-column align-items-center justify-content-center"
                                    style={{
                                        backgroundColor: '#F4F4F4',
                                        borderRadius: '14px',
                                        padding: '15px',
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: 'black',
                                    }}
                                >
                                    <Spinner size="sm" animation="border" variant="primary" />
                                    <div className="fw-bold fs-12 mt-1">
                                        Обновляем список CHECK-IN...
                                    </div>
                                </div>
                            )}
                            {checkinItems.length > 0 &&
                                checkinItems.map((el, index) => (
                                    <CheckinItem checkin={el} task={task} index={index} />
                                ))}
                        </div>

                        {listCount > checkinItems.length && (
                            <Button
                                onlyIcon
                                className="CheckinList__more"
                                onClick={() => getCheckin(checkinItems.length)}
                            >
                                Показать ещё
                            </Button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    );
}
