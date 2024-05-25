import iconAngel from '../assets/img/icon-angel.png';
import iconSad from '../assets/img/icon-sad.png';
import iconEvil from '../assets/img/icon-evil.png';

type Icon = string;

type Detail = {
    text: string;
    icon: Icon|undefined;
}

type Stat = {
    count: number;
    text: string;
    isWarning: boolean;
}

export type Progress = {
    name: string;
    icon: JSX.Element;
    completedCount: number;
    progress: number;
    complexity: string;
    description: string;
    stats: Stats;
    details: Details;
}

export type Details = Detail[];
export type Stats = Stat[];
export type Progresses = Progress[];

export const progresses: Progresses = [
    {
        name: 'Check in',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="40" viewBox="0 0 37 56" style={{position: 'absolute', bottom: '10%', fill: '#8D8794'}}>
                <path d="M18.3033 9.18297C23.3498 9.07797 27.5261 13.0306 27.6365 18.0174C27.6365 18.1073 27.6365 18.1917 27.6365 18.2809C27.6768 23.2677 23.6164 27.3398 18.5651 27.3796C13.5187 27.4139 9.39797 23.407 9.36325 18.4154C9.35838 18.3708 9.35838 18.3255 9.36325 18.2809C9.32297 13.3394 13.3076 9.28727 18.3033 9.18297ZM19.0887 0.00951152C8.87506 -0.313014 0.337034 7.60671 0.00995721 17.6942C-0.0907352 20.7122 0.573835 23.7103 1.93214 26.41L16.0492 54.5006C16.7187 55.8373 18.3589 56.3795 19.7075 55.7186C20.2457 55.4599 20.6783 55.0276 20.9401 54.5006L35.0627 26.41C39.6106 17.371 35.8773 6.39826 26.731 1.90898C24.3511 0.740341 21.7449 0.0946034 19.0887 0.00951152Z"/>
            </svg>
        ),
        completedCount: 0,
        progress: 24,
        complexity: 'Просто',
        description: 'Достижение характеризует вашу интенсивность выполнения Check in',
        stats: [
            {
                count: 2,
                text: 'Всего выполнено',
                isWarning: false,
            },
            {
                count: 2,
                text: 'Нарушений за последние 12 недель',
                isWarning: true,
            },
            {
                count: 6,
                text: 'Всего нарушений',
                isWarning: false,
            }
        ],
        details: [
            {
                text: 'Один полный круг - это 4 недели выполненных в срок Check in по всем вашим OKR и KR задачам',
                icon: undefined
            },
            {
                text: 'Не выполненный в срок Check in - обнуляет один оборот (или 4 выполненных в срок Check in)',
                icon: iconSad
            },
            {
                text: 'Если в течении 12 последних недель было 3 и более не выполнения - все ваши достижения обнуляются',
                icon: iconEvil
            },
        ]
    },
    {
        name: 'Звезды',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 61 51" style={{position: 'absolute', bottom: '10%', fill: '#8D8794'}}>
                <path d="M46.3011 17.5631L47.2003 -0.880859L32.0254 9.62497L14.7757 3.06788L20.0699 20.7584C16.5751 26.2418 2.61708 36.2571 2.61708 36.2571C2.76564 36.1708 19.3588 27.5683 25.2723 21.7758L21.9978 10.8362L32.6664 14.8901L42.0508 8.39374L41.4932 19.8017L50.5666 26.7263L39.5558 29.7217L35.7789 40.4971L29.5305 30.9429C2.20089 42.0329 -24.5701 47.0853 -24.5701 47.0853C-24.5701 47.0853 -5.74571 45.9454 26.956 35.5799L37.0615 51.0302L43.1669 33.6058L60.9719 28.7611L46.3011 17.5631Z"/>
            </svg>
        ),
        completedCount: 8,
        progress: 74,
        complexity: 'Очень сложно',
        description: 'Достижение характеризует сложность и последовательность выполненных вами задач',
        stats: [
            {
                count: 1,
                text: 'Взятых звезд за последние 4 квартала',
                isWarning: true,
            },
            {
                count: 3,
                text: 'Взятых звезд за последние 2 квартала',
                isWarning: false,
            }
        ],
        details: [
            {
                text: 'Один полный круг - это 2 квартала подряд успешное завершение задач с суммарной сложностью 5 звезд в каждый квартал',
                icon: undefined,
            },
            {
                text: 'Например, в один квартал вы взяли 7 звезд, а на следующий менее 5, но больше 2 (3 или 4), то нарушается правило “не менее 5 звезд в квартал”. В этом случае, вы не получаете круг, но достижение первого квартала сохраняется. В случае если в следующем квартале вы возьмете 5+ звезд - по сумме 3 кварталов вы получите достижение.',
                icon: iconAngel,
            },
            {
                text: 'Если же и в следующем квартале у вас не получится взять 5 звезд, то к сожалению сгорает достижение 1го квартала и отнимается один круг',
                icon: iconSad,
            },
            {
                text: 'Если в течении 4 кварталов подряд вы суммарно набираете менее 5 звезд - все ваши достижения обнуляются',
                icon: iconEvil,
            },
        ]
    },
    {
        name: 'Особые успехи',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="45" viewBox="0 0 58 55" style={{position: 'absolute', bottom: '10%', fill: '#8D8794'}}>
                <path d="M28.9841 0C23.2491 0 18.5755 5.15791 18.5755 11.4871C18.5755 17.8162 23.2491 22.9741 28.9841 22.9741C34.7191 22.9741 39.3928 17.8162 39.3928 11.4871C39.3928 5.15791 34.7191 0 28.9841 0ZM28.9841 2.55276C33.4691 2.55276 37.0797 6.53742 37.0797 11.4871C37.0797 16.4367 33.4691 20.4214 28.9841 20.4214C24.4991 20.4214 20.8886 16.4367 20.8886 11.4871C20.8886 6.53742 24.4991 2.55276 28.9841 2.55276ZM7.1704 7.67551C5.57124 7.50971 4.01535 8.62127 3.53398 10.3801L2.52617 14.0644C2.24913 15.0778 2.46547 16.0733 2.88555 16.9414L0.253936 26.7386C0.253936 26.7393 0.253936 26.7399 0.253936 26.7406C-0.416737 29.2423 0.88134 31.7181 2.91259 32.6964L2.91499 32.699C3.25634 32.8681 3.55922 32.9643 3.82966 33.0452C3.8543 33.0519 3.87894 33.0578 3.90418 33.0625L17.421 36.0788L17.4186 53.6066C17.418 53.6908 17.424 53.775 17.4384 53.8579C17.4523 53.9415 17.4733 54.0217 17.5021 54.1007C17.531 54.1789 17.5658 54.2539 17.6079 54.3242C17.65 54.3951 17.698 54.4608 17.7515 54.5205C17.8056 54.5808 17.8639 54.6346 17.9276 54.6823C17.9913 54.7294 18.058 54.7692 18.1289 54.8023C18.1999 54.8348 18.2726 54.8594 18.3477 54.876C18.4228 54.8925 18.4985 54.9012 18.5755 54.9012C18.6518 54.9012 18.7281 54.8925 18.8032 54.876C18.8783 54.8594 18.9511 54.8348 19.022 54.8023C19.0923 54.7692 19.1596 54.7294 19.2233 54.6823C19.2864 54.6346 19.3453 54.5808 19.3988 54.5205C19.4529 54.4608 19.5009 54.3951 19.543 54.3242C19.5845 54.2539 19.6199 54.1789 19.6488 54.1007C19.677 54.0217 19.6986 53.9415 19.7125 53.8579C19.7263 53.775 19.7329 53.6908 19.7317 53.6066L19.7341 35.0349C19.7341 34.9613 19.7281 34.889 19.7167 34.8174C19.7053 34.7451 19.6884 34.6748 19.6662 34.6058C19.644 34.5375 19.6163 34.4712 19.5839 34.4075C19.5508 34.3438 19.5136 34.2841 19.4715 34.2278C19.43 34.1707 19.3837 34.119 19.3339 34.0712C19.2834 34.0235 19.2299 33.9804 19.1734 33.9432C19.1169 33.9054 19.0574 33.8736 18.9955 33.8471C18.9342 33.8205 18.8705 33.8 18.8056 33.7854L4.43723 30.58L4.43062 30.5774C4.17461 30.5011 4.03338 30.4573 3.8543 30.3678C3.84949 30.3651 3.84408 30.3631 3.83867 30.3605C2.72809 29.8266 2.13915 28.7057 2.47209 27.4635L5.21908 17.2353C5.24672 17.1325 5.26235 17.0277 5.26596 16.9209C5.26956 16.8134 5.26115 16.7073 5.24072 16.6025C5.21968 16.4977 5.18783 16.3976 5.14456 16.3021C5.10129 16.2059 5.04781 16.1177 4.9841 16.0368C4.72569 15.7078 4.61632 15.2549 4.74011 14.8025L5.74973 11.1203C5.94144 10.4193 6.55983 10.0565 7.17281 10.2654L11.573 11.7663C12.1866 11.9752 12.5262 12.6829 12.3345 13.3839L11.7017 15.6899C11.6788 15.7728 11.6644 15.8571 11.6572 15.9433C11.65 16.0295 11.6506 16.1151 11.6596 16.2013C11.668 16.2868 11.6842 16.3711 11.7089 16.4533C11.7329 16.5355 11.7642 16.6145 11.8026 16.6894C11.8417 16.7644 11.8868 16.8347 11.9384 16.8997C11.9895 16.9647 12.0466 17.0237 12.1091 17.0761C12.1716 17.1278 12.2377 17.1729 12.3086 17.21C12.3789 17.2479 12.4523 17.277 12.5286 17.2976L14.6674 17.8885C14.9901 17.9781 15.1686 18.3044 15.0875 18.6612C15.0196 18.9616 14.7852 19.1453 14.5298 19.1453C14.4889 19.1453 14.4384 19.1387 14.3874 19.1254H14.3831L10.9132 18.1677C10.8417 18.1478 10.769 18.1359 10.6956 18.1319C10.6217 18.1273 10.5484 18.1306 10.4751 18.1419C10.4018 18.1532 10.3303 18.1717 10.2605 18.1976C10.1908 18.2241 10.1235 18.2573 10.0598 18.2977C9.99552 18.3382 9.93543 18.3846 9.87954 18.4377C9.82365 18.4907 9.77257 18.5491 9.72689 18.6134C9.68062 18.6771 9.64096 18.7448 9.6067 18.817C9.57305 18.8893 9.5454 18.9649 9.52437 19.0432L8.00153 24.7091C7.9787 24.794 7.96427 24.8809 7.95766 24.9691C7.95105 25.058 7.95285 25.1462 7.96307 25.2338C7.97329 25.322 7.99132 25.4075 8.01776 25.4917C8.0442 25.5753 8.07786 25.6556 8.11932 25.7312C8.16079 25.8074 8.20886 25.8777 8.26355 25.9427C8.31824 26.0077 8.37894 26.0654 8.44444 26.1165C8.50995 26.1676 8.57966 26.2107 8.65358 26.2458C8.72749 26.281 8.80382 26.3069 8.88254 26.3248L22.3609 29.3312C22.4372 29.3477 22.5142 29.3564 22.5917 29.3557H35.3789C35.4559 29.3557 35.5316 29.3477 35.6067 29.3312L49.0857 26.3248C49.1644 26.3069 49.2407 26.281 49.3146 26.2458C49.388 26.2107 49.4583 26.1676 49.5238 26.1165C49.5893 26.0654 49.6494 26.0077 49.7047 25.9427C49.7593 25.8777 49.8074 25.8074 49.8489 25.7312C49.8904 25.6556 49.924 25.5753 49.9505 25.4917C49.9769 25.4075 49.9949 25.322 50.0051 25.2338C50.0154 25.1462 50.0172 25.058 50.0105 24.9691C50.0039 24.8809 49.9895 24.794 49.9667 24.7091L48.4438 19.0432C48.4228 18.9649 48.3952 18.8893 48.3615 18.817C48.3273 18.7448 48.2876 18.6771 48.2413 18.6134C48.1956 18.5491 48.1446 18.4907 48.0887 18.4377C48.0328 18.3846 47.9727 18.3382 47.9084 18.2977C47.8441 18.2573 47.7774 18.2241 47.7077 18.1976C47.6373 18.1717 47.5658 18.1532 47.4931 18.1419C47.4198 18.1306 47.3465 18.1273 47.2726 18.1319C47.1992 18.1359 47.1265 18.1478 47.055 18.1677L43.5809 19.1254C43.5298 19.1387 43.4793 19.1453 43.4384 19.1453C43.183 19.1453 42.9486 18.9616 42.8801 18.6612C42.7996 18.3057 42.9775 17.9781 43.3008 17.8885L45.4396 17.2976C45.516 17.277 45.5887 17.2479 45.6596 17.21C45.7305 17.1729 45.7966 17.1278 45.8591 17.0761C45.9216 17.0237 45.9781 16.9647 46.0298 16.8997C46.0815 16.8347 46.1265 16.7644 46.165 16.6894C46.2041 16.6145 46.2353 16.5355 46.2593 16.4533C46.2834 16.3711 46.3002 16.2868 46.3086 16.2013C46.3176 16.1151 46.3182 16.0295 46.311 15.9433C46.3038 15.8571 46.2888 15.7728 46.2666 15.6899L45.6337 13.3839V13.3812C45.4432 12.6809 45.7828 11.9752 46.3952 11.7663L50.7954 10.2654C51.4084 10.0565 52.0262 10.4193 52.2185 11.1203L53.2281 14.8025C53.3519 15.2549 53.2425 15.7078 52.9841 16.0368C52.9204 16.1177 52.8669 16.2059 52.8236 16.3021C52.7804 16.3976 52.7479 16.4977 52.7275 16.6025C52.7071 16.7073 52.6986 16.8134 52.7023 16.9209C52.7059 17.0277 52.7215 17.1325 52.7491 17.2353L55.4961 27.4635C55.8291 28.7057 55.2401 29.8266 54.1295 30.3605C54.1223 30.3638 54.1157 30.3671 54.1091 30.3704C53.9342 30.4586 53.796 30.5018 53.549 30.5747L39.1626 33.7854C39.0869 33.8026 39.0142 33.8272 38.9432 33.8603C38.8723 33.8928 38.805 33.9333 38.7413 33.9804C38.6782 34.0281 38.6193 34.0825 38.5652 34.1429C38.5117 34.2032 38.4637 34.2689 38.4216 34.3398C38.3801 34.4108 38.3447 34.4858 38.3164 34.5647C38.2876 34.6436 38.2666 34.7245 38.2527 34.8081C38.2389 34.891 38.2329 34.9752 38.2341 35.0601C38.2359 35.145 38.2443 35.2286 38.2612 35.3115L38.2365 35.1868V53.6066C38.2353 53.6908 38.2419 53.775 38.2557 53.8579C38.2696 53.9415 38.2912 54.0217 38.3194 54.1007C38.3483 54.1789 38.3831 54.2539 38.4252 54.3242C38.4673 54.3951 38.5154 54.4608 38.5688 54.5205C38.6229 54.5808 38.6818 54.6346 38.7449 54.6823C38.8086 54.7294 38.8759 54.7699 38.9462 54.8023C39.0172 54.8348 39.0899 54.8594 39.165 54.876C39.2401 54.8925 39.3158 54.9012 39.3928 54.9012C39.4697 54.9012 39.5454 54.8925 39.6205 54.876C39.6956 54.8594 39.7684 54.8348 39.8393 54.8023C39.9102 54.7699 39.9769 54.7294 40.0406 54.6823C40.1037 54.6346 40.1626 54.5808 40.2167 54.5205C40.2702 54.4608 40.3182 54.3951 40.3603 54.3242C40.4024 54.2539 40.4372 54.1789 40.4661 54.1007C40.4943 54.0217 40.516 53.9415 40.5298 53.8579C40.5442 53.775 40.5502 53.6908 40.549 53.6066V36.0788L54.064 33.0625C54.0875 33.0578 54.1109 33.0519 54.1337 33.0452C54.4072 32.965 54.7143 32.8681 55.058 32.6964C57.0881 31.7174 58.3843 29.2416 57.7143 26.7406C57.7143 26.7399 57.7143 26.7393 57.7143 26.7386L55.0827 16.9414C55.5027 16.0733 55.7191 15.0778 55.442 14.0644V14.0624L54.4342 10.3801C53.8837 8.37057 51.9312 7.20728 50.1133 7.82739L45.7131 9.32827C43.8952 9.94839 42.8699 12.1125 43.4204 14.1221L43.7005 15.1441L42.7383 15.4107C41.2023 15.8345 40.2521 17.5861 40.6349 19.28V19.282C40.9613 20.7192 42.1398 21.6981 43.4384 21.6981C43.6734 21.6981 43.909 21.6656 44.1385 21.6033C44.1404 21.6033 44.1416 21.6033 44.1434 21.6033L46.5418 20.94L47.3892 24.0983L35.2636 26.8029H22.7071L10.5791 24.0983L11.4264 20.94L13.8249 21.6033C13.8267 21.6033 13.8279 21.6033 13.8297 21.6033C14.0586 21.6656 14.2948 21.6981 14.5298 21.6981C15.8285 21.6981 17.0069 20.7192 17.3333 19.282V19.28C17.7155 17.5854 16.7642 15.8345 15.2299 15.4107L14.2678 15.1441L14.5478 14.1221C15.0983 12.1125 14.073 9.94839 12.2551 9.32827L7.8549 7.82739C7.62773 7.74979 7.39877 7.69873 7.1704 7.67551ZM31.2744 35.7379L29.8675 39.1031L26.671 39.6715L29.0069 42.2588L28.4805 45.9483L31.3309 44.1887L34.1908 45.8959L33.6217 42.2216L35.9234 39.5939L32.7269 39.0753L31.2744 35.7379Z"/>
            </svg>
        ),
        completedCount: 2,
        progress: 100,
        complexity: 'Сложно',
        description: 'Ваши достижения отдельно отмеченные вашим руководителем как достойные “Доски успехов”',
        stats: [
            {
                count: 2,
                text: 'Всего на доске успехов',
                isWarning: false,
            },
            {
                count: 1,
                text: 'На доске успехов за последний 2 квартала',
                isWarning: false,
            }
        ],
        details: [
            {
                text: 'Один полный круг - это 2 квартала подряд отмеченное Доской особых успехов хотя бы одна выполненная вами OKR ли KR задача',
                icon: undefined
            },
            {
                text: 'Если в этом квартале вашу выполненную задачу вынесли в Доску особых успехов, а на следующий квартал таковых не оказалось, то круг придется начинать заново',
                icon: iconSad
            },
            {
                text: 'Достигнутые достижения (полные круги) никогда не сгорают',
                icon: iconAngel
            },
        ]
    }
]