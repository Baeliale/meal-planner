import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertModal, AlertButton } from '../components/parts/AlertModal';

interface AlertOptions {
    title: string;
    message?: string;
    buttons?: AlertButton[];
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [alertOptions, setAlertOptions] = useState<AlertOptions>({
        title: '',
        message: '',
        buttons: [],
    });

    const showAlert = (options: AlertOptions) => {
        setAlertOptions({
            ...options,
            buttons: options.buttons || [{ text: 'OK', style: 'default' }],
        });
        setVisible(true);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            <AlertModal
                visible={visible}
                title={alertOptions.title}
                message={alertOptions.message}
                buttons={alertOptions.buttons}
                onClose={() => setVisible(false)}
            />
        </AlertContext.Provider>
    );
};
