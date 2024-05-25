const baseURL = 'bravo_new/html/server/api/';

/* -------------------
    process.env.API_URL - переменная созданная сборкой для подстановки 
    URL API в зависимости от типа сборки (для разработки или прода).
-------------------*/
export const APIPath = process.env.API_URL + baseURL;
