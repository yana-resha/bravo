import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { Button } from '@/shared/ui/Button';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';
import CheckmarkSVG from '@/shared/ui/svg/CheckmarkSVG/CheckmarkSVG';
import ExclamationMarkInTriangleSVG from '@/shared/ui/svg/ExclamationMarkInTriangleSVG/ExclamationMarkInTriangleSVG';
import SheetWithInscriptionsSVG from '@/shared/ui/svg/SheetWithInscriptionsSVG/SheetWithInscriptionsSVG';
import { getWeekYearFromDate } from '@/shared/utils/getWeekYearFromDate';

enum CheckinStatus {
    DoneAndRead = 'Check-in создан с комментарием и прочитан',
    DoneAndNotRead = 'Check-in создан с комментарием но не прочитан',
    DoneWithoutComment = 'Check-in создан без комментария',
    NotDone = 'Check-in не создан',
    ProgressIsFull = 'Задача выполнена на 100%, Check-in не требуется',
    StartDateNotAchieved = 'Дата начала работ еще не наступила, чекин не требуется',
    NoAccess = 'Нет доступа к данным',
}

type CheckinDateCellProps = {
    title?: string;
    cicreateDate: OKRItemType['cicreateDate'];
    ciSeen: OKRItemType['ciSeen'];
    ciTitle: OKRItemType['ciTitle'];
    responsibles: OKRItemType['responsibles'];
    customer: OKRItemType['customer'];
    director: OKRItemType['rukADLogin'];
    startDate: OKRItemType['startDate'];
    progress: OKRItemType['progress'];
    openCheckinModal: () => void;
    openTaskCheckinCard: () => void;
};

export function CheckinActionCell({
    cicreateDate,
    ciSeen,
    ciTitle,
    responsibles,
    startDate,
    progress,
    customer,
    director,
    openCheckinModal,
    openTaskCheckinCard,
}: CheckinDateCellProps) {
    const currentUser = useSelector((state: StoreReducerType) => state.userData.user);
    const [checkinStatus, setCheckinStatus] = useState<CheckinStatus>(CheckinStatus.NoAccess);
    const [buttonContent, setButtonContent] = useState<string | JSX.Element>('-');

    const updateCheckinStatus = () => {
        const isFullProgress = Number(progress) >= 100;
        const isCheckinTitle = ciTitle ? Boolean(ciTitle.replace(/<(.|\n)*?>/g, '').length) : false;

        const isDoneCheckin =
            cicreateDate && getWeekYearFromDate(null) == getWeekYearFromDate(cicreateDate);

        const isAccess =
            currentUser.login === responsibles[0]?.login ||
            currentUser.login === customer?.login ||
            currentUser.login === director;

        const isStartDateAchieved = startDate
            ? moment(startDate, 'DD.MM.YYYY').isBefore(moment())
            : true;

        if (!isAccess) {
            setCheckinStatus(CheckinStatus.NoAccess);
        } else if (!isStartDateAchieved) {
            setCheckinStatus(CheckinStatus.StartDateNotAchieved);
        } else if (isFullProgress) {
            setCheckinStatus(CheckinStatus.ProgressIsFull);
        } else if (isDoneCheckin && isCheckinTitle && ciSeen) {
            setCheckinStatus(CheckinStatus.DoneAndRead);
        } else if (isDoneCheckin && isCheckinTitle && !ciSeen) {
            setCheckinStatus(CheckinStatus.DoneAndNotRead);
        } else if (isDoneCheckin && !isCheckinTitle) {
            setCheckinStatus(CheckinStatus.DoneWithoutComment);
        } else {
            setCheckinStatus(CheckinStatus.NotDone);
        }
    };

    const updateButtonContent = () => {
        switch (checkinStatus) {
            case CheckinStatus.NotDone:
                setButtonContent(<ExclamationMarkInTriangleSVG style={{ fill: '#FF1B00' }} />);
                break;
            case CheckinStatus.DoneWithoutComment:
                setButtonContent(<CheckmarkSVG style={{ fill: '#979797' }} />);
                break;
            case CheckinStatus.DoneAndNotRead:
                setButtonContent(<SheetWithInscriptionsSVG style={{ stroke: '#979797' }} />);
                break;
            case CheckinStatus.DoneAndRead:
                setButtonContent(<SheetWithInscriptionsSVG style={{ stroke: '#2A85FF' }} />);
                break;
            default:
                setButtonContent('—');
        }
    };

    const handleClickButton = () => {
        const currentUserIsResponsible = responsibles[0].login === currentUser.login;
        const isPossibleInteract =
            checkinStatus === CheckinStatus.DoneAndRead ||
            checkinStatus === CheckinStatus.DoneAndNotRead ||
            checkinStatus === CheckinStatus.DoneWithoutComment ||
            checkinStatus === CheckinStatus.NotDone;

        if (isPossibleInteract) {
            if (currentUserIsResponsible) {
                openCheckinModal();
                return;
            }

            openTaskCheckinCard();
        }
    };

    useEffect(updateButtonContent, [checkinStatus]);
    useEffect(updateCheckinStatus, [
        ciSeen,
        cicreateDate,
        ciTitle,
        progress,
        responsibles,
        customer,
        director,
        startDate,
    ]);

    return (
        <TooltipWhite position="top" content={checkinStatus}>
            <Button onClick={handleClickButton} onlyIcon>
                {buttonContent}
            </Button>
        </TooltipWhite>
    );
}
