import { CSSProperties } from 'react';

type CheckmarkShieldSVGProps = {
    style: CSSProperties;
};

function CheckmarkShieldSVG({ style }: CheckmarkShieldSVGProps) {
    return (
        <svg
            style={style}
            width="17"
            height="17"
            viewBox="0 0 17 17"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.458 0.708984H3.54134C1.97653 0.708984 0.708008 1.97751 0.708008 3.54232V7.08398C0.708008 10.177 2.59187 12.8701 6.2603 15.1444C7.6321 15.9948 9.36725 15.9948 10.739 15.1444L11.0011 14.9793C14.4982 12.7386 16.2913 10.1007 16.2913 7.08398V3.54232C16.2913 1.97751 15.0228 0.708984 13.458 0.708984ZM3.54134 2.12565H13.458C14.2404 2.12565 14.8747 2.75991 14.8747 3.54232V7.08398C14.8747 9.55836 13.3614 11.7845 10.2413 13.7836L9.98816 13.9431C9.07805 14.5073 7.92129 14.5073 7.00676 13.9403C3.71894 11.902 2.12467 9.6229 2.12467 7.08398V3.54232C2.12467 2.75991 2.75894 2.12565 3.54134 2.12565ZM12.5466 4.45629C12.2701 4.17959 11.8216 4.17947 11.5449 4.45602L7.79134 8.20669L6.1702 6.58255L6.10352 6.52357C5.82583 6.30728 5.42402 6.32659 5.16847 6.58171C4.89161 6.8581 4.89124 7.3066 5.16763 7.58345L7.29005 9.70943L7.35676 9.76844C7.63457 9.9848 8.03656 9.96536 8.29207 9.70999L12.5463 5.45802L12.6053 5.39131C12.8214 5.11349 12.8019 4.7117 12.5466 4.45629Z"
            />
        </svg>
    );
}

export default CheckmarkShieldSVG;