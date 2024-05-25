import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { getCheckinStatusColor } from "@/entities/checkIn";
import { OKRItemType } from "@/entities/task/types/OKRItemType"
import IResponsible from "@/entities/user/types/IResponsible";
import { StarList } from "@/shared/ui/StarList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type ComplexityProps = {
    complexity: OKRItemType['complexity'],
    statusCheckin: OKRItemType['statusCheckin'],
    responsibles: IResponsible [],
}

export function ComplexityCell ({complexity, statusCheckin, responsibles} : ComplexityProps) {

    const cntComplexity = complexity ? Number(complexity) : 0;
    const [opacity, setOpacity] = useState<number>(1);
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);

    useEffect(() => {
        if (responsibles.some(resp => resp.login == currentUser.login)) {
            setOpacity(1);
        } else {
            setOpacity(0.3);
        }
    }, [responsibles])
    return (
        <>
            { cntComplexity > 0 && (
                <StarList 
                    value={cntComplexity} 
                    status={statusCheckin ? getCheckinStatusColor(statusCheckin) : 'default'} 
                    opacity={opacity}
                />
            )}
        </>
    )
}