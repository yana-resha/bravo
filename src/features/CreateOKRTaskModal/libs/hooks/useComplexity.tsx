import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StoreReducerType } from '@/app/providers/storeProvider/config/storeConfig';
import { IFormResponsible } from '@/features/CreateTaskModal/types/IFormResponsible';
import { userRoles } from '@/entities/user/types/userTypes';
import { showInfoAlert } from '@/shared/utils/showInfoAlert';
import { ResponsibleType } from '@/shared/types/responsibleType';

export function useComplexity(
    responsible: IFormResponsible | null,
    isEditTask: boolean,
    initialValue: number | null | undefined,
    initialResponsible: ResponsibleType | undefined,
) {
    const currentUser = useSelector((state: StoreReducerType) => state.userData.user);
    const [complexityValue, setComplexityValue] = useState(initialValue ?? 0);
    const [complexityDisabled, setComplexityDisabled] = useState(true);
    const [userComplexity, setUserComplexity] = useState(0);
    const maxUserComplexity = currentUser.role === userRoles.superUser ? 13 : 10;
    const [differenceComplexity, setDifferenceComplexity] = useState(0); // Разница между userComplexity и maxUserComplexity
    
    useEffect(() => {
        setComplexityValue(0);
        setUserComplexity(0);

        currentUser.login !== responsible?.login ? setComplexityDisabled(false) : setComplexityDisabled(true);
        
        if (responsible && maxUserComplexity >= userComplexity + complexityValue) {
            setUserComplexity(Number(responsible.cntComplexity) + complexityValue);
            let difference = maxUserComplexity - Number(responsible.cntComplexity ?? 0);
            setDifferenceComplexity(difference);
            
        }

        if (isEditTask) {
            initialResponsible?.login !== responsible?.login
                ? setComplexityValue(0)
                : setComplexityValue(initialValue ?? 0);
        } else {
            setComplexityValue(0);
        }
    }, [responsible]);


    const handlerComplexity = (value: number) => {
        if (differenceComplexity < value) {
            setComplexityValue(differenceComplexity);
            showInfoAlert({
                type: 'error',
                text: `Общая сложность по сотруднику не должна превышать ${maxUserComplexity}`,
                format: 'full',
            });

            return;
        }

        setUserComplexity(Number(responsible?.cntComplexity) + value);
        setComplexityValue(value);
    };

    return {
        complexityValue,
        handlerComplexity,
        complexityDisabled,
        differenceComplexity,
        userComplexity,
        maxUserComplexity,
    };
}
