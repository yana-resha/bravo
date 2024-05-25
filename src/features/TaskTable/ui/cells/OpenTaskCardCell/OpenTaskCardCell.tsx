import { OKRItemType } from "@/entities/task/types/OKRItemType"
import { Button } from "@/shared/ui/Button";

type OpenTaskCardCellProps = {
    openTaskCard: () => void;
}

export function OpenTaskCardCell ({openTaskCard} : OpenTaskCardCellProps) {
    return (
    <>
        <Button onlyIcon title='Перейти на карточку задачи' onClick={() => openTaskCard()}>
            <svg className='mb-1 mt-1' width="19" height="19" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0V8.5H17.7333V2.07627L5.91027 12.6548L5.01473 11.8535L16.9961 1.13333H9.5V0H19ZM13.9333 15.8667H1.26667V4.53333H9.59373V3.4H0V17H15.2V8.25747H13.9333V15.8667Z" fill="black" />
            </svg>
        </Button>
    </>
    )
}