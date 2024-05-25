import { CSSProperties } from "react";

type StarCircleHalfSVGProps = {
  style: CSSProperties;
}

function StarCircleHalfSVG ({ style }: StarCircleHalfSVGProps) {
    return (
      <svg style={ style } width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM8.5 7.9L4.3 8.15L7.56 10.8L6.5 14.85L10 12.5898L13.5 14.498L12.8096 10.8L15.6538 8.15L11.6424 7.9L10 4L8.5 7.9ZM10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2L12.3093 7.1L17.5 7.5L13.8 11.1L14.7 16.15L10 13.65V18Z" />
      </svg>
    )
}

export default StarCircleHalfSVG;
