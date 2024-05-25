import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { OKRItemType } from "@/entities/task/types/OKRItemType"
import { TooltipWhite } from "@/shared/ui/TooltipWhite";
import { useSelector } from "react-redux";

type AttentionCellProps = {
    openAttentionCard: () => void;
    waitfor: OKRItemType['waitfor'],
    responsibles: OKRItemType['responsibles'],
}

export function AttentionCell ({openAttentionCard, waitfor, responsibles} : AttentionCellProps) {
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    return (
        <>
            {
                waitfor !== null && waitfor > 0 && (
                    <TooltipWhite
                        position='top'
                        content={
                            responsibles[0].login === currentUser.login ? 'Количество инициированных изменений' : 'Ожидает согласования'
                        }
                    >
                        <div
                            onClick={() => openAttentionCard()}
                            role='button'
                            className={`counterTaskAttention ${responsibles[0].login === currentUser.login ? 'counterTaskAttention__iresp' : 'counterTaskAttention__imanage'}`}>
                            {waitfor}
                        </div>
                    </TooltipWhite>
                )
            }
        </>
    )
}