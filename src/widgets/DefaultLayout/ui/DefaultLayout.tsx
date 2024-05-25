import { Layout } from '@consta/uikit/Layout';
import { Sidebar } from '@/widgets/Sidebar';
import { Navbar } from '@/widgets/navbar';
import { useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import cl from './defaultLayout.module.scss'
import { getPathLoginPage } from '@/shared/const/router';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { fetchUser, setUserLogin } from '@/app/model/slices/userSlice';

export function DefaultLayout({children}: any) {
    const { pathname } = useLocation();
    const [isAuth, setIsAuth] = useState(true);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const login = useSelector((state: StoreReducerType) => state?.userData?.user.login);

    useEffect(() => {

        pathname === getPathLoginPage() ? setIsAuth(true) : setIsAuth(false);
    }, [pathname]);

    useEffect(() => {
        if (isAuth === false) {
            dispatch(setUserLogin());
        }
        
    }, [isAuth]);

    useEffect(() => {
        if (login) dispatch(fetchUser({login}));
    }, [login])

    return (
        
        <Layout className={`${isAuth ? cl.auth : cl.app}`} direction="row">
            {isAuth === false && <Sidebar />}
            <Layout direction="column" className={cl.contentBlock}>
                {isAuth === false && (
                    <Navbar />
                )}
                
                <div className={`${isAuth ? cl.authContainer : cl.pagesContainer}`}>
                    {children}
                </div>
            </Layout>
            
        </Layout>
    )
}