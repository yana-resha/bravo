import './EditBtn.scss';

type EditBtnPropsType = {
    widthIcon?: number | null, 
    heightIcon?: number | null, 
    className?: string | null, 
    title?: string | null,
    handleClick?: Function
}

export const EditBtn = ({ widthIcon = null, heightIcon = null, className = null, title = null, handleClick = () => {} }: EditBtnPropsType) => {
    const width = widthIcon ?? 24;
    const height = heightIcon ?? 24;

    return (
        <button className={`EditBtn ${className ?? ''}`} onClick={() => handleClick()} title={title ?? ''}>
            <svg width={width} height={height} viewBox={`0 0 24 24`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.8787 2.87868L7.29289 11.4645C7.10536 11.652 7 11.9064 7 12.1716V16.1716C7 16.7239 7.44772 17.1716 8 17.1716H12C12.2652 17.1716 12.5196 17.0662 12.7071 16.8787L21.2929 8.29289C22.4645 7.12132 22.4645 5.22183 21.2929 4.05025L20.1213 2.87868C18.9497 1.70711 17.0503 1.70711 15.8787 2.87868ZM19.8787 5.46447L19.9619 5.55867C20.2669 5.95096 20.2392 6.5182 19.8787 6.87868L11.584 15.1716H9V12.5856L17.2929 4.29289C17.6834 3.90237 18.3166 3.90237 18.7071 4.29289L19.8787 5.46447ZM11.0308 4.17157C11.0308 3.61929 10.5831 3.17157 10.0308 3.17157H6L5.78311 3.17619C3.12231 3.28975 1 5.48282 1 8.17157V18.1716L1.00462 18.3885C1.11818 21.0493 3.31125 23.1716 6 23.1716H16L16.2169 23.167C18.8777 23.0534 21 20.8603 21 18.1716V13.2533L20.9933 13.1366C20.9355 12.6393 20.5128 12.2533 20 12.2533C19.4477 12.2533 19 12.701 19 13.2533V18.1716L18.9949 18.3478C18.9037 19.9227 17.5977 21.1716 16 21.1716H6L5.82373 21.1665C4.24892 21.0752 3 19.7693 3 18.1716V8.17157L3.00509 7.9953C3.09634 6.42049 4.40232 5.17157 6 5.17157H10.0308L10.1474 5.16485C10.6448 5.10708 11.0308 4.68441 11.0308 4.17157Z" fill="#0A1629"/>
            </svg>     
        </button>
    );
}