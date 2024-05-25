/* Hooks */
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/shared/hooks/useAuth';
import { useTitle } from '@/shared/hooks/useTitle';

/* API */
import { cloudAuthAPI } from '@/shared/api/CloudAuth/CloudAuthAPI';

/* Components */
import { Button } from '@consta/uikit/Button';
import { AnimationPage } from '@/shared/ui/AnimationPage';

/* Styles */
import './LoginPage.scss';

/* Images */
import logo from '@/shared/assets/img/logo/logo_png.png';

const LoginPage = () => {
    useTitle('Вход');

    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';
    const [login, setLogin] = useState<string | null>(null);
    const [statusAuth, setStatusAuth] = useState<boolean>(false);
    const [flagDisabled, setFlagDisabled] = useState<boolean>(true);

    const handleMessagePage = (event: MessageEvent) => {
        if (
            event.origin !== 'https://inside' 
            || (
                event.origin === 'https://inside' 
                && event.data.login === undefined
            )
        ) return;
        
        setLogin(event.data.login);
        setStatusAuth(true);
    }

    useEffect(() => {
        window.addEventListener("message", handleMessagePage);

        return () => {
            window.removeEventListener("message", handleMessagePage);
        }
    });

    useEffect(() => setFlagDisabled(!statusAuth), [statusAuth]);

    const handlerClick = async () => {
        if (!login) {
            alert('Неудачная авторизация через Inside - не удалось получить логин');
            return;
        }

        window.localStorage.setItem('token', login);

        try {

            /* -------------------
                process.env.IS_DEV - переменная созданная сборкой!
                Смотреть файл config/build/buildPlugins.ts
            -------------------*/
            if (process.env.IS_DEV) {
                const response = await cloudAuthAPI(login);
                if (!response) {
                    throw new Error('Ошибка сервера');
                }
            }

            setAuth(true);
            navigate(from, { replace: true });  
        } catch(error: any) {
            console.error(error);
            alert('Произошла ошибка: ' + error.message);
        }
    }

    return (
        <AnimationPage>
            <div className='card-bravo-auth'>
                <img src={logo} className='card-bravo-auth__logo'></img>
                <h1 className="fs-18 mb-3">Вход в систему Bravo</h1>
                <div className='card-bravo-auth__desc'>
                    Авторизация в системе Bravo выполняется автоматически после нажатия на кнопку "Войти". Данные для авторизации берутся из системы Inside.
                </div>   
                <div className='card-bravo-auth__container-btn'>
                    <Button
                        width="full"
                        label="Войти"
                        onClick={handlerClick}
                        disabled={flagDisabled}
                    />
                </div>
                <iframe id="authIframe" src="https://inside/insideNew/auth_page.php" width={0} height={0}></iframe>
            </div>
        </AnimationPage>
    )
}

export default LoginPage;