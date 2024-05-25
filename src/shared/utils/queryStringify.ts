type StringIndexed = Record<string, any>;
type Primitive = string | boolean | number;

function queryStringify(data: StringIndexed): string | never {
    if (typeof data !== 'object') {
        throw new Error("input must be an object");
    }

    let query = '';
    let currentIndex = 1;
    let countKeys = Object.keys(data).length;
    for (let key in data) {
        if (Array.isArray(data[key])) {
            query += stringifyArray(key, data[key]);
        }
        else if (typeof data[key] === 'object') {
            query += stringifyObject(key, data[key]);
        }
        else {
            query += stringifyPrimitive(key, data[key]);
        }

        if (currentIndex < countKeys) {
            query += '&';
        }

        currentIndex++;
    }

    return query;
}

function stringifyArray(key: string, array: []): string {
    let string: string = array.reduce((result, item, index, array) => {
        let fullKey: string = `${key}[${index}]`;

        if (Array.isArray(item)) {
            result += stringifyArray(fullKey, item);
        }
        else if (typeof item === 'object') {
            result += stringifyObject(fullKey, item);
        }
        else {
            result += `${fullKey}=${item}`;
        }

        if (index < array.length - 1) {
            result += '&';
        }

        return result;
    }, '');

    return string;
}

function stringifyObject(key: string, object: StringIndexed): string {
    let string: string = '';
    let currentIndex = 0;
    let countKeys = Object.keys(object).length;
    for (let label in object) {
        let fullKey = `${key}[${label}]`;
        if (Array.isArray(object[label])) {
            string += stringifyArray(fullKey, object[label]);
        }
        else if (typeof object[label] === 'object') {
            string += stringifyObject(fullKey, object[label]);
        }
        else {
            string += `${fullKey}=${object[label]}`;
        }

        if (currentIndex < countKeys - 1) {
            string += '&';
        }
        currentIndex++;
    }

    return string;
}

function stringifyPrimitive(key: string, value: Primitive): string {
    return `${key}=${value}`;
}

export default queryStringify;