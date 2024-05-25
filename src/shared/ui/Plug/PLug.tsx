import './Plug.scss';

type PlugProps = {
    title: string | JSX.Element;
}

export function Plug({ title }: PlugProps): JSX.Element {
    return <div className="plug">{ title }</div>;
}
