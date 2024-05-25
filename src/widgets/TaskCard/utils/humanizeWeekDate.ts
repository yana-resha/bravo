const humanizeWeekDate = (weekDate: string, endingText: string) => weekDate.split('-').reverse().map((el, index) => {
    if (index == 0) {
        if (el.startsWith('0')) {
            el = el.substring(1)
        }
        el = el + endingText
    }
    
    return el;
}).join(" ");

export default humanizeWeekDate;