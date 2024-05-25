import "./ErrorPage.scss";
import { Button } from '@consta/uikit/Button';
import type { Error } from "../types/Error";
import { useNavigate } from "react-router-dom";
import { getPathMain } from "@/shared/const/router";
import { AnimationPage } from "@/shared/ui/AnimationPage";
import { useTitle } from "@/shared/hooks/useTitle";

type Props = {
    type: Error;
}

export const ErrorPage = ({ type }: Props) => {
    useTitle('Ошибка');

    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate(getPathMain());
    }

    return (
        <AnimationPage>
            <div className="error-page">
                <div className="error-page__wrapper">
                    <div className="error-page__info">
                        <p className='error_page__title'>{type.title}</p>
                        <p className='error_page__description'>{type.description}</p>
                        <Button label="Вернуться на главную" size="l" onClick={handleButtonClick} />
                    </div>
                    <img className="error-page__image" src={type.image} alt="Девушка чинит робота" width={484} height={318} />
                </div>
            </div>
        </AnimationPage>
    )
}
