import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import React, { ReactNode } from "react"

export type ListType = {
    [key: string] : any,
}

export type ListItemProps = {
    label: string,
    id: string,
    item: ListType,
    onClick: (id: string) => void,
    active: boolean,
}

export type renderItemProps = {
    [key: string] : any;
}


export type AutoCompleteInputType = {
    setDefaultValue?: boolean,
    isDefaultValueAlreadySet?: () => void,
    inValid?: boolean,
    list:  any [],
    getItemLabel: string,
    getItemID: string,
    placeholder?: string,
    isListLoad?: boolean,
    defaultValue?: any | null,
    setValues?: (item: any | null) => void,
    CustomItem?:  React.ElementType,
    disabled?: boolean,
    onInput?: (value: string) => void;
    offFilterList?: boolean,
    emplyListLabel?: string,
}