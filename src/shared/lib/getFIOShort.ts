export function getFIOShort(fio: string) {
    let arr = fio.split(" ");
    arr = arr.map((str, index) => {
        if (index > 0) {
            str = str[0] + '.'
        };

        return str;
    })
    return arr.join(" ");
}