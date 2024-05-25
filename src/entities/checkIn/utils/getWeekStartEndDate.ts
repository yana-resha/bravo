import moment from "moment";

export function getWeekStartEndDate(week: number, year: string, format: string = 'DD.MM.YYYY') : [string, string] {
    
    let startWeek = moment(year, 'YYYY')
    .week(week)
    .locale('ru')
    .startOf('week');

    let endWeek = moment(year, 'YYYY')
    .week(week)
    .locale('ru')
    .endOf('week');
    return [startWeek.format(format), endWeek.format(format)];
}