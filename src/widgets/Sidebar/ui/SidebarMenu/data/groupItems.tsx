import { 
    getPathAbout, 
    getPathBacklog, 
    getPathDirectReports, 
    getPathGradeSubcontractors, 
    getPathKanbanBoard, 
    getPathMain, 
    getPathOKR, 
    getPathPersonnelCommittee, 
    getPathProjects, 
    getPathSummarizing, 
    getPathTKBStar, 
    getPathTargetsGroup 
} from "@/shared/const/router";
import AddReminderSVG from "@/shared/ui/svg/AddReminderSVG/AddReminderSVG";
import BarChartSVG from "@/shared/ui/svg/BarChartSVG/BarChartSVG";
import ChecklistSVG from "@/shared/ui/svg/ChecklistSVG/ChecklistSVG";
import ClipboardSVG from "@/shared/ui/svg/ClipboardSVG/ClipboardSVG";
import ErrorSVG from "@/shared/ui/svg/ErrorSVG/ErrorSVG";
import FinancialSuccessSVG from "@/shared/ui/svg/FinancialSuccessSVG/FinancialSuccessSVG";
import GoalSVG from "@/shared/ui/svg/GoalSVG/GoalSVG";
import HumanResearchSVG from "@/shared/ui/svg/HumanResearchSVG/HumanResearchSVG";
import KanbanSVG from "@/shared/ui/svg/KanbanSVG/KanbanSVG";
import ManagementSVG from "@/shared/ui/svg/ManagementSVG/ManagementSVG";
import Management from "@/shared/ui/svg/ManagementSVG/ManagementSVG";
import NoticeSVG from "@/shared/ui/svg/NoticeSVG/NoticeSVG";
import SquaresFourSVG from "@/shared/ui/svg/SquaresFourSVG/SquaresFourSVG";
import StarSVG from "@/shared/ui/svg/StarSVG/StarSVG";
import View360SVG from "@/shared/ui/svg/View360SVG/View360SVG";

export function createGroupItems () {
    return [

        {
            groupName: '',
            items: [
                // {
                //     leftIcon: <SquaresFourSVG styleProps={{width: '100%',height: '100%', fill: '#999999',}}/>,
                //     title: 'Я - БРАВО',
                //     rightIcons: [],
                //     sublineText: '',
                //     href: '/bravo', 
                // },

                {
                    leftIcon: <ChecklistSVG styleProps={{width: '100%',height: '100%'}}/>,
                    title: 'ЗАДАЧИ',
                    rightIcons: [],
                    // rightIcons: [<ErrorSVG styleProps={{width: '20px',height: '20px'}}/>, <NoticeSVG styleProps={{width: '20px',height: '20px'}}/>],
                    // sublineText: <span className="color-success">34%&#8593;</span>,
                    href: getPathOKR(),
                },
            ]
        },
        {
            groupName: 'ОБЩЕБАНК',
            items: [
                {
                    leftIcon: <GoalSVG styleProps={{width: '100%',height: '100%'}}/>,
                    title: 'Цели группы',
                    rightIcons: [],
                    sublineText: '',
                    href: getPathMain(), // Временно делаем её главной
                },

                // {
                //     leftIcon: <BarChartSVG styleProps={{width: '100%',height: '100%'}}/>,
                //     title: 'Обзор Банка - KPI Группы',
                //     rightIcons: [],
                //     sublineText: '',
                //     href: getPathAbout(),
                // },
            ]
        },
    
        // {
        //     groupName: '',
        //     items: [

        //         {
        //             leftIcon: <ChecklistSVG styleProps={{width: '100%',height: '100%'}}/>,
        //             title: 'Бэклог',
        //             rightIcons: [],
        //             // sublineText: <span className="color-success">6</span>,
        //             href: getPathBacklog(),
        //         },

        //         {
        //             leftIcon: <ClipboardSVG styleProps={{width: '100%',height: '100%'}}/>,
        //             title: 'Проекты',
        //             rightIcons: [],
        //             // sublineText: <span className="color-danger">17%</span>,
        //             href: getPathProjects(),
        //         },

        //         {
        //             leftIcon: <FinancialSuccessSVG styleProps={{width: '100%',height: '100%'}}/>,
        //             title: 'Подведение итогов',
        //             rightIcons: [],
        //             // rightIcons: [<ErrorSVG styleProps={{width: '20px',height: '20px'}}/>],
        //             sublineText: '',
        //             href: getPathSummarizing(),
        //         },
        //     ]
        // },


        // {
        //     groupName: 'Я И МОЯ КОМАНДА',
        //     items: [
        //         {
        //             leftIcon: <ManagementSVG styleProps={{width: '100%',height: '100%'}}/>,
        //             title: 'Direct Reports',
        //             rightIcons: [],
        //             // rightIcons: [],
        //             sublineText: '',
        //             href: getPathDirectReports(),
        //         },

        //         {
        //             leftIcon: <KanbanSVG styleProps={{width: '100%',height: '100%'}}/>,
        //             title: 'Kanban доска',
        //             rightIcons: [],
        //             // rightIcons: [<AddReminderSVG styleProps={{width: '20px',height: '20px'}}/>],
        //             sublineText: '',
        //             href: 'https://inside/bravo/pages/kanban/',
        //             // getPathKanbanBoard(),
        //         },

        //         {
        //             leftIcon: <HumanResearchSVG  styleProps={{width: '100%',height: '100%'}}/>,
        //             title: 'Кадровый комитет',
        //             rightIcons: [],
        //             sublineText: '',
        //             href: 'https://inside/insideNew/pages/hr-control/index.php',
        //             // getPathPersonnelCommittee(),
        //         },
        //     ]
        // },


        // {
        //     groupName: '',
        //     items: [
        //         {
        //             leftIcon: <View360SVG styleProps={{width: '100%',height: '100%'}}/>,
        //             title: 'Оценка смежников',
        //             rightIcons: [],
        //             // rightIcons: [<ErrorSVG styleProps={{width: '20px',height: '20px'}}/>],
        //             sublineText: '',
        //             href: 'https://inside/insideNew/pages/360-degree-feedback/',
        //             // getPathGradeSubcontractors(),
        //         },

        //         {
        //             leftIcon: <StarSVG styleProps={{width: '100%',height: '100%'}}/>,
        //             title: 'ТКБ Звезда',
        //             rightIcons: [],
        //             sublineText: '',
        //             href: 'https://inside/bravo/pages/tkb-zvezda/',
        //             // getPathTKBStar(),
        //         },
        //     ]
        // },


    ];
}