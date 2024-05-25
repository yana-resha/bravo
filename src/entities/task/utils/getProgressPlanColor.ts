import moment from "moment";

const getProgressPlanColor = (progress: number, dueDate: Date, startDate: Date) : {color: "danger" | "warning" | "success", planValue: number} => {
    
    let start = moment(startDate);
    var end = moment(dueDate);
    let dayToWork = end.diff(start, 'days');
    let remainedDay = end.diff(moment(), 'days');

    
    let x = remainedDay/dayToWork;
    if (Number.isNaN(x)) x = 0;
    let planValue: number = Math.ceil((1 - x) * 100);
    if (planValue > 100) planValue = 100;
    
    let differenceVal: number = planValue - progress;
    let color: "danger" | "warning" | "success" = 'success';
    if (differenceVal > 10) {
        color = 'danger';
    } else if (differenceVal > 0 && differenceVal <= 10) {
        color = 'warning';
    }
    return {
        planValue: planValue,
        color: color,
    }
}

export default getProgressPlanColor;