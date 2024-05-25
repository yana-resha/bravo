import { KRItemType } from "../types/KRItemType";
import { OKRItemType } from "../types/OKRItemType";

export default function getListWithoutDuplicate(list: (OKRItemType | KRItemType)[]) {
    const newList = list.filter((item, index, self) => {
        return self.find((elem) => elem.id === item.id);
    });

    return newList;
}