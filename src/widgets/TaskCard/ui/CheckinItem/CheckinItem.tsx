import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { CheckinItemType, CheckinStatus } from '@/entities/checkIn/types/CheckinType';
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { AnimationListItem } from '@/shared/ui/AnimationListItem';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';
import { useSelector } from 'react-redux';
import { AvatarItem } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import checkinAPIService from '@/entities/checkIn/services/CheckinAPIService';
import { bgThemeEnum } from '@/shared/ui/Badge/types/badgeProps';
import humanizeWeekDate from '../../utils/humanizeWeekDate';
import useOnScreen from '../../model/hooks/useOnScreen';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { updateChildTask } from '@/entities/task/model/slices/childTaskSlice';
import { updateOKRTask } from '@/entities/task/model/slices/okrListSlice';
import { getWeekStartEndDate } from "@/entities/checkIn/utils/getWeekStartEndDate";

type CheckinItemProps = {
    checkin: CheckinItemType;
    task: OKRItemType;
    index: number;
};

export const CheckinItem = ({ checkin, task, index }: CheckinItemProps) => {
    const checkinItemRef = useRef(null);
    const currentUser = useSelector((state: StoreReducerType) => state.userData.user);
    const [isSeen, setIsSeen] = useState<string | null>(checkin.ciSeen);
    const isVisibleElement = useOnScreen(checkinItemRef);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    let [start, end] = getWeekStartEndDate(
        Number(checkin.cd.split('-')[1]), 
        checkin.cd.split('-')[0], 
        'DD.MM.YYYY'
    );

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        if (
            task.customer?.login === currentUser.login &&
            checkin.id &&
            !checkin.ciSeen &&
            isVisibleElement
        ) {
            
            const newTimeoutFunc = () =>
                markAsRead(checkin.id, humanizeWeekDate(checkin.cd, '-й недели'));
            timeout = setTimeout(newTimeoutFunc, 1500);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [checkin, isVisibleElement]);

    const markAsRead = async (checkinID: number | string, titleWeek: string) => {
        const request = {
            login: String(currentUser.login),
            id: +checkinID,
            idTask: +task.id,
            ciSeen: moment().format('YYYY-MM-DD hh:mm:ss'),
        };

        await checkinAPIService
            .updateCheckIN(request)
            .then((response) => {
                if (response) {
                    setIsSeen(response.ciSeen);

                    if (task.idParent) {
                        dispatch(updateChildTask({ id: task.id, ciSeen: response.ciSeen }));
                    } else {
                        dispatch(updateOKRTask({ id: task.id, ciSeen: response.ciSeen }));
                    }
                }
            })
            .catch(() => {
                showInfoAlert({
                    type: 'error',
                    text: `Чекин ${titleWeek} не удалось отметить прочитанным`,
                });
            });
    };

    let statusColor = bgThemeEnum.success;
    if (checkin.ciStatus == CheckinStatus.danger) statusColor = bgThemeEnum.danger;
    if (checkin.ciStatus == CheckinStatus.warning) statusColor = bgThemeEnum.warning;

    return (
        <AnimationListItem key={checkin.id ?? checkin.cd} index={index} ref={checkinItemRef}>
            <div key={checkin.id ?? checkin.cd} className="CheckinListItem">
                <div className="CheckinListItem__week">
                    {!isSeen && checkin.id && (
                        <TooltipWhite content="Чекин не просмотрен руководителем!">
                            <span className="CheckinListItem__isSeen"></span>
                        </TooltipWhite>
                    )}
                    {humanizeWeekDate(checkin.cd, '-я неделя')}
                    <span className="CheckinListItem__week-days fw-normal ms-2">({start} - {end})</span>
                </div>
                {checkin.id && (
                    <>
                        <div className="CheckinListItem__header">
                            <div className="CheckinListItem__date-block">
                                <div className="CheckinListItem__date">{checkin.updateDate}</div>
                            </div>
                            <div className="CheckinListItem__status-block">
                                <div className="d-flex flex-row justify-content-end">
                                    <Badge
                                        className="fw-normal me-2"
                                        fontSize={16}
                                        borderRadius="pill"
                                        theme={statusColor}
                                    >
                                        {checkin.ciStatus}
                                    </Badge>
                                </div>
                                <div className="CheckinListItem__progress">
                                    {checkin.progresschange ?? 0}% -{'>'} {checkin.procent ?? 0}%
                                </div>
                                <AvatarItem login={checkin.updateLogin} fio={checkin.updateFIO} />
                            </div>
                        </div>
                        <div
                            className="CheckinListItem__comment"
                            dangerouslySetInnerHTML={{ __html: checkin.title }}
                        ></div>
                    </>
                )}

                {!checkin.id && (
                    <div className="CheckinListItem__comment-null">Check-in не произведен</div>
                )}
            </div>
        </AnimationListItem>
    );
};
