import { Route, Routes } from "react-router-dom";
import { Suspense, memo } from "react";
import { PageLoader_ColorCircle } from "@/shared/ui/PageLoader_ColorCircle";
import { AnimatePresence } from "framer-motion";
import { routes } from "../data/routes";
import PrivateRoute from "./PrivateRoute";
import { LoginPage } from "@/pages/LoginPage";
import { getPathLoginPage } from "@/shared/const/router";

const AppRouter = () => {
    const withLoader = (component: JSX.Element) => {
        return (
            <Suspense fallback={ <PageLoader_ColorCircle/> }>
                <div style={{minHeight: '100%'}}>
                    <AnimatePresence mode="wait">
                        {component}
                    </AnimatePresence>
                </div>
            </Suspense>
        )
    }

    return (
        <Routes>
            <Route 
                key={getPathLoginPage()}
                path={getPathLoginPage()}
                element={ withLoader(<LoginPage />) }
            />
            <Route element={ <PrivateRoute /> }>
                { routes.map(({name, path, element}) => {
                    if (name === 'LoginPage') return "";
                    
                    return <Route
                        key={path}
                        path={path}
                        element={withLoader(element)}
                    />
                })}
            </Route>
        </Routes>
    )
}

export default memo(AppRouter);