import { OKRItemType } from "@/entities/task/types/OKRItemType"

type WeightCellProps = {
    weight: OKRItemType['weight'],
}

export function WeightCell ({weight} : WeightCellProps) {

    
    return (
        <>
            {weight} %
        </>
    )
}