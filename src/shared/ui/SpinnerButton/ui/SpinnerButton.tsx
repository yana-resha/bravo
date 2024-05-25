import { Spinner } from "react-bootstrap";
import { SpinnerButtonType } from "../types/SpinnerButtonTypes";
import cl from './SpinnerButton.module.scss';
export function SpinnerButton(props: SpinnerButtonType) {
    const {classNames = '', size} = props;
    return (
        <Spinner
          className={`${cl.btnSpinner} ${size ? cl[size] : ''} ${classNames}`}
          as="span"
          animation="border"
          role="status"
          aria-hidden="true"
        />
    )
}