import { MainPage } from "@/pages/MainPage";
import { LoginPage } from "@/pages/LoginPage";
import {
    getPathAbout, 
    getPathBacklog, 
    getPathDefault, 
    getPathMain, 
    getPathNotFoundPage, 
    getPathOKR, 
    getPathProjects, 
    getPathLoginPage,
    getPathTargetsGroup,
    getPathSummarizing,
    getPathDirectReports,
    getPathKanbanBoard,
    getPathPersonnelCommittee,
    getPathGradeSubcontractors,
    getPathTKBStar
} from "@/shared/const/router";
import { ErrorPage } from "@/pages/ErrorPage";
import { TypeErrorPage } from "@/pages/ErrorPage/data/TypePageError";
import { TargetGroupPage } from "@/pages/TargetsGroupPage";
import { OKRPage } from "@/pages/OKRPage";

export const routes = [
    {    
        name: 'Login',
        path: getPathLoginPage(),
        element: <LoginPage />
    },
    {    
        name: 'Bravo',
        path: '/bravo', // #TODO Временно подменяем главную станицу
        element: <MainPage />
    },
    {
        name:'TargetsGroup',
        path: getPathMain(), // #TODO Временно делаем её главной
        element: <TargetGroupPage />
    },
    {
        name: 'Tasks',
        path: getPathOKR(),
        element: <OKRPage />
    },
    {
        name: 'Tasks',
        path: '/okr2',
        element: <OKRPage version={2} />
    },
    {
        path: getPathAbout(),
        element: <ErrorPage type={TypeErrorPage.InDev} />
    },

    {
        path: getPathBacklog(),
        element: <ErrorPage type={TypeErrorPage.InDev} />
    },
    {
        path: getPathProjects(),
        element: <ErrorPage type={TypeErrorPage.InDev} />
    },
    {
        path: getPathSummarizing(),
        element: <ErrorPage type={TypeErrorPage.InDev} />
    },
    {
        path: getPathDirectReports(),
        element: <ErrorPage type={TypeErrorPage.InDev} />
    },
    {
        path: getPathKanbanBoard(),
        element: <ErrorPage type={TypeErrorPage.InDev} />
    },
    {
        path: getPathPersonnelCommittee(),
        element: <ErrorPage type={TypeErrorPage.InDev} />
    },
    {
        path: getPathGradeSubcontractors(),
        element: <ErrorPage type={TypeErrorPage.InDev} />
    },
    {
        path: getPathTKBStar(),
        element: <ErrorPage type={TypeErrorPage.InDev} />
    },
    {
        path: getPathNotFoundPage(),
        element: <ErrorPage type={TypeErrorPage.NotFound} />
    },
    {
        path: getPathDefault(),
        element: <ErrorPage type={TypeErrorPage.NotFound} />
    }
];
