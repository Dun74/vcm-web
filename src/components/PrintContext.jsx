import React, { createContext, useState } from "react";

export const PrintContext = createContext({
    print: false,
    setPrint: (val) => { }
});

export const PrintProvider = ({ children }) => {

    const [print, setPrint] = useState(false)

    return (
        <PrintContext.Provider
            // @ts-ignore
            value={{ print: print, setPrint: setPrint }}>
            {children}
        </PrintContext.Provider>
    );
};