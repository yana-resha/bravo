import { AppRouter } from '../providers/router';
import { StoreProvider } from '../providers/storeProvider/ui/StoreProvider';
import { AuthProvider } from '../../app/providers/AuthProvider/AuthProvider';
import DefaultLayout from '@/widgets/DefaultLayout';
import './App.scss';
import  { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

/* -------------------
    process.env.IS_DEV - переменная созданная сборкой!
    Смотреть файл config/build/buildPlugins.ts
-------------------*/
const basename = process.env.IS_DEV ? '/' : '/bravo_new';

export function App () {
    return (
        <BrowserRouter basename={basename}>
            <StoreProvider>
                <SnackbarProvider maxSnack={5} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <AuthProvider>
                        <DefaultLayout>
                            <AppRouter />
                        </DefaultLayout>
                        <Toaster/>
                    </AuthProvider>
                </SnackbarProvider>
            </StoreProvider>
        </BrowserRouter>
    )
}