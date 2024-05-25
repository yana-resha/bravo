import { useState } from "react";
import { HashtagItemType } from '../../types/HashtagType';
import { hashtagItems } from "../../data/hashtagItems";


export function useHashtags() {
    const [hashtagValue, setHashtagValue] = useState<HashtagItemType[] | null>();
    const [hashtagList, setHashtagList] = useState<HashtagItemType[]>(hashtagItems);

    const handleCreateHashtag = (label: HashtagItemType['label']) => {
        setHashtagValue(prevValue => {
            let newValue = [{ label, id: `${label}_${hashtagList.length + 1}` }, ...prevValue??[]];
            return newValue;
        })
        setHashtagList(prevValue => {
            let newValue = [{ label, id: `${label}_${hashtagList.length + 1}` }, ...prevValue];
            return newValue;
        });
    }


    return { hashtagValue, setHashtagValue, hashtagList, setHashtagList, handleCreateHashtag }
}