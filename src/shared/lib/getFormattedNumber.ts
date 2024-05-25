

/**
 * Функция добавления в число разделителей разрядов, с настройкой минимального и максимального кол-ва знаков после запятой
 * value Число в формате строки 
 *  decimal Кол-во знаков после запятой 
 * 
 */

export function getFormattedNumber(value : string, minDecimal = 0, maxDecimal = 0) {
    const regexFloat = /[^\-0-9.]/g;
    let newValue = value.replace(regexFloat, '');
    value = value.replace(/(\..*)\./g, '$1');
    if (newValue[value.length - 1] !== '.') {
        newValue = new Intl.NumberFormat("ru", { minimumFractionDigits: minDecimal, maximumFractionDigits: maxDecimal }).format(Number(newValue));
        newValue = newValue.replace(',', '.');
    }
    return newValue;
}