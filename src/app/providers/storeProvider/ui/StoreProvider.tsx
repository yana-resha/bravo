
import React from 'react';
import { Provider } from 'react-redux';
import {store} from '../config/storeConfig';

type ProviderChildren = {
    children?: React.ReactNode,
}

export function StoreProvider({children} : ProviderChildren) {


    return (
        <Provider store={store}>
            {children}
        </Provider>
        
        
    )
}