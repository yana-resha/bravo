
import { createContext, useState } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    setAuth: (auth: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setAuth: () => { }
});

export const AuthProvider = ({ children } : { children: any }) => {
    const hasToken = Boolean(window.localStorage.getItem('token'));
    const [isAuthenticated, setAuth] = useState<boolean>(hasToken);
    return (
        <AuthContext.Provider value={ {isAuthenticated, setAuth} }>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthContext;