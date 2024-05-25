import { CSSProperties } from 'react';

type SheetWithInscriptionsSVGProps = {
    style: CSSProperties;
};

function SheetWithInscriptionsSVG({ style }: SheetWithInscriptionsSVGProps) {
    return (
        <svg style={style} width="14" height="16" viewBox="0 0 14 16" fill='none'>
            <path
                d="M4 3.85538H10M4 6.71077H10M4 9.56615H6.25M2.5 15.2769H11.5C12.3284 15.2769 13 14.6377 13 13.8492V2.42769C13 1.6392 12.3284 1 11.5 1H2.5C1.67157 1 1 1.6392 1 2.42769V13.8492C1 14.6377 1.67157 15.2769 2.5 15.2769Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default SheetWithInscriptionsSVG;
