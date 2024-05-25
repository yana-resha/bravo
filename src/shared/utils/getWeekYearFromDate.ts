import moment from "moment"

export const getWeekYearFromDate = (date: string | null = null, dateType: string = 'YYYY-MM-DD HH:mm:ss') => {
    if (date && date.length > 0) {
        return `${moment(date, dateType).week() < 10 ? '0' + moment(date, dateType).week() : moment(date, dateType).week()}-${moment(date, dateType).format('YYYY')}`;
    } else {
        return `${moment().week() < 10 ? '0' + moment().week() : moment().week()}-${moment().format('YYYY')}`;
    }
    
}