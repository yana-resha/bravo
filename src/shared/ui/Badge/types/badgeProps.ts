export enum bgThemeEnum  {
  primary ='primary',
  ligthPink = 'ligth-pink',
  success = 'success',
  danger = 'danger', 
  warning = 'warning',
  lightBlue = 'light-blue',
  lightGrey = 'light-grey',
  lightBeige =  'light-beige',
  terra =  'terra',
  darkBlue =  'dark-blue',
  calmGrey =  'calm-green',
}

export type BadgePropsType = {
  children?:  React.ReactNode | React.ReactElement | string,
  theme?: bgThemeEnum,
  className?: string,
  title?: string,
  borderRadius?: 'pill' | 'circle',
  textColor?: 'dark' | 'light',
  textWeight?: 'normal' | 'light',
  fontSize?: number,
  styleObj?: React.CSSProperties,
}