import { CSSProperties } from 'react';

type CheckmarkSVGProps = {
    style: CSSProperties;
};

function CheckmarkSVG({ style }: CheckmarkSVGProps) {
    return (
        <svg style={style} width="15" height="13" viewBox="0 0 15 13">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.10574 9.96692L13.4197 0L14.6847 1.51654L5.10574 13L0 6.87913L1.26503 5.36259L5.10574 9.96692Z"
            />
        </svg>
    );
}

export default CheckmarkSVG;
