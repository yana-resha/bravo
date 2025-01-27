import { useContext } from "react";
import AuthContext from "../../app/providers/AuthProvider/AuthProvider";

const useAuth = () => {
    return (
        useContext(AuthContext)
    );
}

export default useAuth;
