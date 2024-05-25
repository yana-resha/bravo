export type AvatarItemType = {
  [key:string]: any,
}

export type AvatarNullType = {
  items: AvatarItemType []
}

export type addBtnType = {
    btnTitle?: string
    onClick?: () => void,
}

export type AvatarGroupType = {
  items: AvatarItemType [],
  maxLength?: number,
  addBtn?: addBtnType,
  className?: string,
}