import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { ModalActionType } from '@/features/CreateTaskModal/types/ModalActionType';
import { IFormResponsible } from '@/features/CreateTaskModal/types/IFormResponsible';
import IResponsible from '@/entities/user/types/IResponsible';
import { userRoles } from '@/entities/user/types/userTypes';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { ResponsibleType } from '@/shared/types/responsibleType';

export function useStars(
    responsible: IFormResponsible | null,
    isEditTask: boolean,
    initialValue: number | null | undefined,
    initialResponsible: ResponsibleType | undefined
) {
    const currentUser = useSelector((state: StoreReducerType) => state.userData.user);
    const [starsValue, setStarsValue] = useState(initialValue ?? 0);
    const [starDisabled, setStarDisabled] = useState(true);
    const [userComplexity, setUserComplexity] = useState(0);
    const maxUserComplexity = currentUser.role === userRoles.superUser ? 13 : 10;
    const [differenceComplexity, setDifferenceComplexity] = useState(0); // Разница между userComplexity и maxUserComplexity

    useEffect(() => {
        currentUser.login !== responsible?.login ? setStarDisabled(false) : setStarDisabled(true);
        if (
            responsible &&
            maxUserComplexity >= userComplexity + starsValue
        ) {
            setUserComplexity(Number(responsible.cntComplexity) + starsValue);
            setDifferenceComplexity(maxUserComplexity - Number(responsible.cntComplexity ?? 0));
        }

        if (isEditTask) {
            initialResponsible?.login !== responsible?.login
                ? setStarsValue(0)
                : setStarsValue(initialValue ?? 0);
        } else {
            setStarsValue(0);
        }
    }, [responsible]);

    const handlerStars = (value: number) => {
        if (differenceComplexity < value) {
            setStarsValue(differenceComplexity);
            showInfoAlert({
                type: 'error',
                text: `Общая сложность по сотруднику не должна превышать ${maxUserComplexity}`,
                format: 'full',
            });

            return;
        }

        setUserComplexity(Number(responsible?.cntComplexity) + value);
        setStarsValue(value);
    };

    console.log(userComplexity, responsible, responsible?.cntComplexity);

    return {
        starsValue,
        handlerStars,
        starDisabled,
        differenceComplexity,
        userComplexity,
        maxUserComplexity,
    };
}
