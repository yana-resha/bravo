// https://qna.habr.com/q/587015
export default function numberShorter(
    value: number,
    fixed: number = 0, 
    symbols: string[] = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
) {
    if (!value) return String(value);

    var index = Math.floor(Math.log10(value) / 3);
    return (value / Math.pow(10, 3 * index))
        .toFixed(fixed) + (symbols[index] === undefined 
                ? ('e' + index * 3) 
                : symbols[index]);
}


// console.log(numberShorter(0));
// console.log(numberShorter(123));
// console.log(numberShorter(1234));
// console.log(numberShorter(1234567));
// console.log(numberShorter(1234567890));
// console.log(numberShorter(1234567890123));
// console.log(numberShorter(1234567890123456));
// console.log(numberShorter(1234567890123456789));
// console.log(numberShorter(1234567890123456789012));
// console.log(numberShorter(1234567890123456789012345));
