import { FilterKeys } from "@/widgets/OKRList/types/FilterType"

export type tabTypes = {
    label: string,
    icon: React.ReactNode,
    id: FilterKeys,
    active?: boolean,
}

export const tabsList : tabTypes [] = [
    {
        id: FilterKeys.period,
        label: 'Период',
        icon: <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 7.38889V12.5L16.3333 16.3333M24 12.5C24 18.8513 18.8513 24 12.5 24C6.14873 24 1 18.8513 1 12.5C1 6.14873 6.14873 1 12.5 1C18.8513 1 24 6.14873 24 12.5Z" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>,
    },

    {
        id: FilterKeys.responsibles,
        label: 'Сотрудник',
        icon: <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.53161 8.74364C4.50879 8.98725 4.49707 9.23504 4.49707 9.48631C4.49707 12.9749 6.75951 15.8029 9.55033 15.8029C12.3412 15.8029 14.6036 12.9749 14.6036 9.48631C14.6036 8.97018 14.5541 8.46849 14.4606 7.98828" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.2251 8.87962C12.2251 9.37186 11.8255 9.77096 11.3337 9.77096C10.8419 9.77096 10.4424 9.37186 10.4424 8.87962C10.4424 8.38782 10.8419 7.98828 11.3337 7.98828C11.8255 7.98828 12.2251 8.38782 12.2251 8.87962Z" fill="#7D8592" />
        <path d="M8.65865 8.87962C8.65865 9.37186 8.25911 9.77096 7.76731 9.77096C7.27552 9.77096 6.87598 9.37186 6.87598 8.87962C6.87598 8.38782 7.27552 7.98828 7.76731 7.98828C8.25911 7.98828 8.65865 8.38782 8.65865 8.87962Z" fill="#7D8592" />
        <path d="M9.55041 13.3362C9.03709 13.3362 8.52373 13.2087 8.0141 12.9538C7.79386 12.8437 7.70463 12.576 7.81476 12.3558C7.92466 12.1359 8.19188 12.0464 8.41276 12.1565C9.17832 12.5395 9.92255 12.5395 10.6881 12.1565C10.9085 12.0464 11.176 12.1359 11.2861 12.3558C11.3962 12.576 11.307 12.8437 11.0868 12.9538C10.5771 13.2087 10.0638 13.3362 9.55041 13.3362Z" fill="#7D8592" />
        <path d="M21.4633 24.0007H14.9531V15.6953H20.2232V16.6367H21.4633V24.0007Z" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.3818 14.1543H22.989V22.4597" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.2246 15.6953L21.4646 16.6367" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.2676 18.4629H20.0258" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.2676 20.2891H20.0258" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.2676 21.8848H20.0258" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.46801 18.4629C8.46801 18.4629 7.9304 21.1465 9.4963 21.1465C11.0622 21.1465 10.5246 18.4629 10.5246 18.4629" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.48 21.625L10.9219 22.5958" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.75713 5.20532C5.75713 5.20532 10.2743 8.75235 10.4417 6.2923C10.4417 6.2923 12.8195 7.98856 14.4605 7.98869C17.3276 7.98892 14.4022 2.42702 9.49571 1.2505C8.09448 0.915 5.08676 0.468306 5.08676 3.23782C5.08676 3.23782 1.69183 5.12363 4.497 8.83074L4.5376 8.68242C4.67714 7.30999 5.75713 5.20532 5.75713 5.20532Z" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.05571 22.6316C1.05571 22.6316 0.164372 16.8379 5.51239 16.8379C6.93492 17.7862 8.1536 18.4416 9.52341 18.4388H9.4677C10.8375 18.4416 12.0562 17.7862 13.4787 16.8379" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.1159 21.1476L8.03952 22.5937L5.51174 16.8379L3.74805 20.6188L7.96309 22.5937" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.4792 16.8379L10.9514 22.5937L9.875 21.1476" stroke="#7D8592" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>,
    },
    {
        id: FilterKeys.checkin,
        label: 'Check-in',
        icon: 
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M18.208 0.958984H4.79134C2.67425 0.958984 0.958008 2.67523 0.958008 4.79232V9.58398C0.958008 13.7686 3.50676 17.4123 8.46993 20.4892C10.3259 21.6398 12.6734 21.6398 14.5294 20.4892L14.8839 20.2658C19.6153 17.2344 22.0413 13.6655 22.0413 9.58398V4.79232C22.0413 2.67523 20.3251 0.958984 18.208 0.958984ZM4.79134 2.87565H18.208C19.2666 2.87565 20.1247 3.73377 20.1247 4.79232V9.58398C20.1247 12.9317 18.0774 15.9434 13.856 18.6481L13.5135 18.8639C12.2822 19.6273 10.7172 19.6273 9.47985 18.8602C5.03162 16.1025 2.87467 13.019 2.87467 9.58398V4.79232C2.87467 3.73377 3.7328 2.87565 4.79134 2.87565ZM16.9749 6.02886C16.6008 5.65451 15.994 5.65435 15.6196 6.0285L10.5413 11.1029L8.34803 8.90558L8.25782 8.82578C7.88212 8.53315 7.3385 8.55927 6.99274 8.90444C6.61818 9.27838 6.61767 9.88517 6.99161 10.2597L9.86313 13.1361L9.95338 13.2159C10.3292 13.5086 10.8731 13.4823 11.2188 13.1368L16.9746 7.38415L17.0543 7.29389C17.3467 6.91802 17.3203 6.37442 16.9749 6.02886Z" fill="#7D8592"/>
        </svg>
        ,
    },

    {
        id: FilterKeys.status,
        label: 'Статус',
        icon: 
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 11.925C1 5.8875 5.8875 1 11.925 1" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22.8507 11.9258C22.8507 17.9633 17.9632 22.8508 11.9257 22.8508C7.62471 22.8508 3.89871 20.3668 2.11621 16.7443" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.7998 4.44922H21.6998" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.7998 7.90039H18.2498" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24.0002 23.9992L21.7002 21.6992" stroke="#7D8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>,
    },

    {
        id: FilterKeys.complexity,
        label: 'Сложность (звезды)',
        icon: 
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 23C17.8513 23 23 17.8513 23 11.5C23 5.14873 17.8513 0 11.5 0C5.14873 0 0 5.14873 0 11.5C0 17.8513 5.14873 23 11.5 23Z" fill="#ADB1B9" />
              <path opacity="0.2" d="M19.0109 10.0992C18.9031 9.73984 18.6156 9.52422 18.2562 9.45234L14.1952 8.87734L12.3624 5.17578C12.2187 4.85234 11.8593 4.63672 11.4999 4.63672C11.1406 4.63672 10.8171 4.85234 10.6374 5.17578L8.80462 8.87734L4.74368 9.45234C4.38431 9.48828 4.09681 9.73984 3.98899 10.0992C3.88118 10.4586 3.95306 10.818 4.24056 11.0695L7.18743 13.9445L6.50462 17.9695C6.43274 18.3289 6.57649 18.6883 6.86399 18.9039C7.04368 19.0117 7.22337 19.0836 7.40306 19.0836C7.54681 19.0836 7.69055 19.0477 7.8343 18.9758L11.4999 17.0711L15.1296 18.9758C15.2734 19.0477 15.4171 19.0836 15.5609 19.0836C15.7406 19.0836 15.9562 19.0117 16.0999 18.9039C16.3874 18.6883 16.5312 18.3289 16.4593 17.9695L15.8124 13.9086L18.7593 11.0336C19.0109 10.818 19.1187 10.4227 19.0109 10.0992Z" fill="#ADB1B9" />
              <path d="M19.0109 9.38047C18.9031 9.02109 18.6156 8.80547 18.2562 8.73359L14.1952 8.15859L12.3624 4.45703C12.2187 4.13359 11.8593 3.91797 11.4999 3.91797C11.1406 3.91797 10.8171 4.13359 10.6374 4.45703L8.80462 8.15859L4.74368 8.73359C4.38431 8.76953 4.09681 9.02109 3.98899 9.38047C3.88118 9.73984 3.95306 10.0992 4.24056 10.3508L7.18743 13.2258L6.50462 17.2508C6.43274 17.6102 6.57649 17.9695 6.86399 18.1852C7.04368 18.293 7.22337 18.3648 7.40306 18.3648C7.54681 18.3648 7.69055 18.3289 7.8343 18.257L11.4999 16.3523L15.1296 18.257C15.2734 18.3289 15.4171 18.3648 15.5609 18.3648C15.7406 18.3648 15.9562 18.293 16.0999 18.1852C16.3874 17.9695 16.5312 17.6102 16.4593 17.2508L15.8124 13.1898L18.7593 10.3148C19.0109 10.0992 19.1187 9.70391 19.0109 9.38047Z" fill="white" />
            </svg>,
    },

    {
        id: FilterKeys.direction,
        label: 'Направление бизнеса',
        icon: 
            <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.95878 4.24271H22.1627C23.796 4.24461 25.1195 5.56814 25.1214 7.20126V20.0413C25.1195 21.6746 23.796 22.9981 22.1629 23H2.95885C1.32549 22.9981 0.00193099 21.6746 0 20.0415V7.20146C0.00190591 5.56814 1.32544 4.24461 2.95855 4.24271H2.95872H2.95878ZM22.1627 21.3253C22.871 21.3233 23.4448 20.7496 23.4467 20.0415V7.20146C23.4448 6.49311 22.871 5.91938 22.1629 5.91748H2.9588C2.25043 5.91938 1.6767 6.49311 1.67482 7.20128V20.0413C1.6767 20.7496 2.25043 21.3233 2.9586 21.3253H2.95878H22.1627ZM20.0413 13.3981H13.8447V13.2864H5.0801C2.27571 13.2832 0.00318488 11.0107 0 8.20662V7.08981C0.00190591 5.4565 1.32544 4.13297 2.95855 4.13106H22.1626C23.7959 4.13297 25.1195 5.4565 25.1214 7.08961V8.31792C25.1182 11.1224 22.8456 13.3949 20.0415 13.398H20.0412L20.0413 13.3981ZM15.5195 11.7233H20.0413C21.9213 11.7214 23.4447 10.1979 23.4466 8.31814V7.08979C23.4447 6.38144 22.871 5.80771 22.1628 5.8058H2.95878C2.2504 5.80771 1.67667 6.38144 1.67479 7.08961V8.20632C1.67667 10.0863 3.20017 11.6098 5.07993 11.6116H15.5194L15.5195 11.7233ZM13.3981 14.4029H11.7233V10.6068H13.3981L13.3981 14.4029ZM17.8619 5.91748H7.25507L8.65629 0H16.4562L17.8619 5.91748ZM9.37645 4.24271H15.7406L15.132 1.67474H9.9805L9.37645 4.24271Z" fill="#7D8592" />
            </svg>,
    },


]