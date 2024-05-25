import cl from '../ui/badge.module.scss';
import { BadgePropsType, bgThemeEnum } from '../types/badgeProps';
import { LegacyRef, forwardRef } from 'react';



const badgeTheme = {
  primary: cl.badgePrimary,
  'ligth-pink': cl.badgeLightPink,
  'light-blue': cl.badgeLightBlue,
  'light-grey': cl.badgeLightGrey,
  'light-beige': cl.badgeLightBeige,
  'success': cl.badgeSuccess,
  'warning': cl.badgeWarning,
  'danger': cl.badgeDanger,
  'terra': cl.badgeTerra,
  'dark-blue':cl.badgeDarkBlue,
  'calm-green': cl.badgeCalmGreen,
}

const textColorTheme = {
  light: cl.textLight,
  dark: cl.textDark,
}

const textWeightTheme = {
  'normal': cl.textWeightNormal,
  'light': cl.textWeightLight,
}

const borderRadiusTheme = {
  'pill': cl.pillBorder,
  'circle': cl.circleBorder,
}


export const Badge = forwardRef(function ({children, styleObj, theme = bgThemeEnum.primary, title = '', className = '', fontSize, borderRadius, textColor, textWeight} : BadgePropsType, ref : LegacyRef<HTMLSpanElement> | undefined) {


    return (
      <span 
      className={`
      ${cl.badge} 
      ${theme? badgeTheme[theme] : badgeTheme['primary']} 
      ${textColor? textColorTheme[textColor] : ''} 
      ${textWeight? textWeightTheme[textWeight] : ''} 
      ${borderRadius? borderRadiusTheme[borderRadius] : ''} 
      ${className}
      `} 

      style={{
        fontSize : fontSize ? `${fontSize}px` : "",
        ...styleObj,
      }}
      title={title}
      ref={ref}
      >
        {children}
      </span>
    )
})




