/* Hooks */
import { useState } from "react";
import { BisinessAreaType } from "../../types/bisinessAreaType";
import { bisinessAreas } from "../../data/okr/businessAreas";

export function useBusinessArea() {
    const [bisinessArea, setBisinessAreas] = useState<BisinessAreaType | null>(null);
    const bisinessAreaList = bisinessAreas;

    return { bisinessAreaList, bisinessArea, setBisinessAreas }
}