import moment from "moment";

const getDaysFromDate = (date: string, dateType: string = 'YYYY-MM-DD HH:mm:ss') => {
    const diff = moment().diff(moment(date, dateType), 'days');
    if (diff == 1) {
        return '1 день'
    } else {
        return diff ? moment.duration(diff, 'day').locale('ru').humanize({d:365}) : 0;
    }
    
};

export default getDaysFromDate;