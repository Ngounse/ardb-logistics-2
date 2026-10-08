"use client";

import {
    createContext,
    useContext,
    useCallback,
    useMemo,
    useState,
} from "react";
import PopupAlert from "./PopupAlert";

interface ErrorContextType {
    readonly showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType>({
    showError: () => { },
});

export const ErrorProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const showError = useCallback((msg: string) => {
        setMessage(msg);
        setOpen(true);
    }, []);

    const contextValue = useMemo(() => ({ showError }), [showError]);

    return (
        <ErrorContext.Provider value={contextValue}>
            {children}

            <PopupAlert
                title=""
                description={message}
                open={open}
                close={() => setOpen(false)}
            />
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);