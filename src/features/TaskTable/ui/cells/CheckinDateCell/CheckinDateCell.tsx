import { OKRItemType } from '@/entities/task/types/OKRItemType';
import { TooltipWhite } from '@/shared/ui/TooltipWhite';
import { getDaysFromDate } from '@/shared/utils';
import moment from 'moment';

enum CheckinStatus {
    Done = 'Сделан',
    Expected = 'Ожидается',
    Expired = 'Просрочен',
    NotRequired = 'Не требуется',
}

enum WatchColor {
    Green = 'rgba(66, 189, 83, 0.35)',
    Blue = 'rgba(74, 150, 254, 0.35)',
    Yellow = 'rgba(242, 157, 56, 0.35)',
}

type CheckinDateCellProps = {
    cicreateDate: OKRItemType['cicreateDate'];
    progress: OKRItemType['progress'];
    startDate: OKRItemType['startDate'];
};

export function CheckinDateCell({ cicreateDate, progress, startDate }: CheckinDateCellProps) {
    const diffDays = moment().diff(moment(cicreateDate, 'YYYY-MM-DD HH:mm:ss'), 'days') || 0;

    const isNotRequiredCheckin =
        moment().isBefore(moment(startDate, 'DD.MM.YYYY')) || progress >= 100;

    const status = (() => {
        const isThereCheckins = Boolean(cicreateDate);

        if (!isThereCheckins) {
            return CheckinStatus.Expected;
        } else if (isNotRequiredCheckin) {
            return CheckinStatus.NotRequired;
        } else if (diffDays <= 6 && diffDays >= 0) {
            return CheckinStatus.Done;
        } else if (diffDays > 6 && diffDays <= 10) {
            return CheckinStatus.Expected;
        } else {
            return CheckinStatus.Expired;
        }
    })();

    const watchColor = (() => {
        if (status === CheckinStatus.Done) {
            return WatchColor.Green;
        } else if (status === CheckinStatus.Expected) {
            return WatchColor.Blue;
        } else if (status === CheckinStatus.Expired) {
            return WatchColor.Yellow;
        }
    })();

    const daysFromLastCheckin = cicreateDate
        ? getDaysFromDate(cicreateDate) || 'Меньше одного дня'
        : 'Чекинов не было';

    return (
        <div className="me-2">
            {!isNotRequiredCheckin && (
                <TooltipWhite content={daysFromLastCheckin}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={watchColor}>
                        <path
                            d="M11 5V11H17"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </TooltipWhite>
            )}
            <span className="ms-1">{status}</span>
        </div>
    );
}
