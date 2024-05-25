function StarSVG({ styleProps }: any ) {
    
    return (
        <svg style={styleProps} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="100%" height="100%" fill="url(#pattern57)"/>
        <defs>
        <pattern id="pattern57" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_1071_1073" transform="scale(0.0111111)"/>
        </pattern>
        <image id="image0_1071_1073" width="90" height="90" xlinkHref="data:image/png;base64,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"/>
        </defs>
        </svg>

    )
}

export default StarSVG;