const getProgressColor = (progress: number) => {
    if (progress < 30) {
        return '#BB271A';
    } else if (progress >= 30 && progress < 50) {
        return '#FFB100';
    } else if (progress >= 50 && progress < 70) {
        return '#3F8CFF'
    } else {
        return '#42bd53';
    } 
}

export default getProgressColor;