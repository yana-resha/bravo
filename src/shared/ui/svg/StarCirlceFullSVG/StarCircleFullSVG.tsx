import { CSSProperties } from "react";

type StarCircleFullSVGProps = {
  style: CSSProperties;
}

function StarCircleFullSVG ({ style }: StarCircleFullSVGProps) {
    return (
      <svg style={ style } width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 19.998C15.5228 19.998 20 15.5209 20 9.99805C20 4.4752 15.5228 -0.00195312 10 -0.00195312C4.47715 -0.00195312 0 4.4752 0 9.99805C0 15.5209 4.47715 19.998 10 19.998ZM11.5165 7.91274L10 4L8.48351 7.91274L4.29366 8.1459L7.54627 10.7973L6.47329 14.8541L10 12.58L13.5267 14.8541L12.4537 10.7973L15.7063 8.1459L11.5165 7.91274Z" />
      </svg>
    )
}

export default StarCircleFullSVG;
