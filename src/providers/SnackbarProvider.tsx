import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, SnackbarType } from '../components/parts/Snackbar';

interface SnackbarOptions {
    message: string;
    type?: SnackbarType;
    duration?: number;
    action?: {
        label: string;
        onPress: () => void;
    };
}

interface SnackbarContextType {
    showSnackbar: (options: SnackbarOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<SnackbarOptions>({
        message: '',
        type: 'notification',
        duration: 3000,
    });

    const showSnackbar = (snackbarOptions: SnackbarOptions) => {
        setOptions({
            type: 'notification',
            duration: 3000,
            ...snackbarOptions,
        });
        setVisible(true);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                visible={visible}
                message={options.message}
                type={options.type}
                duration={options.duration}
                action={options.action}
                onDismiss={() => setVisible(false)}
            />
        </SnackbarContext.Provider>
    );
};
