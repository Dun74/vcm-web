import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const TranslationContext = createContext({
    trads: {}
});

export const TranslationProvider = ({ children }) => {

    const [trads, setTrads] = useState({})

    useEffect(() => {
        const tradString = localStorage.getItem('trads');
        if (tradString) {
            setTrads(JSON.parse(tradString));
        }
    }, [])

    const context = {
        trads: trads
    };
    return (
        <TranslationContext.Provider value={context}>
            {children}
        </TranslationContext.Provider>
    );
};