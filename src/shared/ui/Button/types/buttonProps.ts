export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonColorType = 'danger' |'light-blue' | 'dark-blue' | 'primary' | 'bright-pink' | 'success' | 'outline-dark' | 'clear' | 'outline-light' | 'light' |undefined;
export type ButtonPropsType = {
  children?:  React.ReactNode | React.ReactElement | string,
  size?: 'lg' | 'sm',
  disabled?: boolean,
  color?: ButtonColorType,
  className?: string,
  title?: string,
  active?: boolean,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  type?: ButtonType,
  onlyIcon?: boolean,
  borderRadius?: 'default' | 'pill' | 'circle',
  
}