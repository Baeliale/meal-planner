import { StyleSheet } from 'react-native';

const baseColors= {
    primary: '#f8be2a',
    primaryLight: '#f4cd68',
    primaryDark: '#c79820',
    secondary: '#e65858',
    secondaryLight: '#ec7474',
    secondaryDark: '#c53333',
}

export const colors = {
    ...baseColors,
    error: baseColors.secondary,
    success: '#4CAF50',
    notification: '#5a9fc7',
    background: {
        light: '#faf5f3',
        dark: '#3e3e3e',
    },
    textPrimary: {
        light: '#000000',
        dark: '#ffffff',
    },
    textSecondary: {
        light: '#3f3f3f',
        dark: '#cccccc',
    },
    surface1: {
        light: '#f6e5b6',
        dark: '#5e5e5e',
    },
    surface2: {
        light: '#faefd2',
        dark: '#6f6f6f',
    },
    surface3: {
        light: '#fbf6ea',
        dark: '#7f7f7f',
    },
    border: {
        light: '#dcc892',
        dark: '#444',
    },
};

export const styles = StyleSheet.create({
    app: {
        flexDirection: 'column',
        backgroundColor: colors.background.light,
        minHeight: '100%',
        maxHeight: '100%',
        width: '100%',
        color: colors.textPrimary.light,
    },
    topBar: {
        width: '100%',
        height: 90,
        paddingBlockStart: 30,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25)',
        elevation: 4,
    },
    mainArea: {
        width: '100%',
        padding: 30,
        paddingBlockEnd: 30,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBlockEnd: 16,
    },
    logo: {
        height: 30,
        maxWidth: 200,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBlockEnd: 16,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBlockEnd: 8,
    },
    text: {
        fontSize: 16,
        color: colors.textPrimary.light,
    },
    toolBar: {
        width: '100%',
        height: 100,
        paddingBlockEnd: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px -1px 3px rgba(0, 0, 0, 0.25)',
    },
    toolBarButton: {
        height: '100%',
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBlockEnd: 4,
        borderTopWidth: 4,
        borderTopColor: 'transparent',
    },
    toolBarButtonActive: {
        borderTopColor: colors.textPrimary.light,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.textPrimary.dark,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonIcon: {
        paddingHorizontal: 15,
    },
    buttonPrimary: {
        backgroundColor: colors.primary,
    },
    buttonSecondary: {
        backgroundColor: colors.secondary,
    },
    buttonTransparent: {
        backgroundColor: 'transparent',
    },
    buttonIconOnly: {
        backgroundColor: 'transparent',
        padding: 0,
    },
    buttonText: {
        color: colors.textPrimary.dark,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonPrimaryText: {
        color: colors.textPrimary.light,
    },
    buttonSecondaryText: {
        color: colors.textPrimary.dark,
    },
    listItem: {
        padding: 12,
        marginBlockEnd: 8,
        backgroundColor: colors.surface1.light,
        borderRadius: 8,
        fontSize: 16,
        overflow: 'hidden',
        alignItems: 'center',
    },
    listItemText: {
        color: colors.textPrimary.light,
    },
    form: {
        backgroundColor: colors.surface1.light,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border.light,
        marginBlockEnd: 16,
    },
    label: {
        marginBlockEnd: 4,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: colors.surface2.light,
        color: colors.textPrimary.light,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        backgroundColor: colors.surface2.light,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 4,
        padding: 10,
        marginBlockEnd: 12,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerContainer: {
        gap: 8,
    },
    picker: {
        flexDirection: 'column',
    },
    pickerButton: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerDropdown: {
        marginBlockStart: 4,
        backgroundColor: colors.surface2.light,
        color: colors.textPrimary.light,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 4,
        paddingInline: 10,
        fontSize: 16,
        maxHeight: 150,
    },
    pickerItem: {
        paddingBlock: 8,
    },
    rows: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    columns: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        gap: 2,
    },
    container: {
        flexDirection: 'column',
        gap: 20,
    },
    marginTop: {
        marginBlockStart: 10,
    },
    marginBottom: {
        marginBlockEnd: 10,
    },
    modal: {
        position: 'relative',
        zIndex: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalBackdrop: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    modalContent: {
        backgroundColor: colors.surface1.light,
        borderRadius: 12,
        width: '100%',
        maxWidth: 600,
        maxHeight: '80%',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
        elevation: 5,
        zIndex: 2,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    modalHeaderButtons: {
        flexDirection: 'row',
        gap: 10,
        marginBlockStart: -10,
        marginInlineEnd: -10,
    },
    modalBody: {
        padding: 20,
    },
    modalSection: {
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    modalBullet: {
        fontSize: 16,
        marginVertical: 4,
        paddingLeft: 10,
        color: colors.textPrimary.light,
    },
    slideMenu: {
        width: 40,
        height: 50,
        position: 'relative',
    },
    slideMenuToggleWrapper: {
        position: 'absolute',
        inset: -12,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 12,
        backgroundColor: colors.surface1.light,
        borderRadius: 12,
    },
    slideMenuContent: {
        position: 'absolute',
        flexDirection: 'row',
        left: -10,
        insetBlock: -12,
        gap: 12,
        padding: 12,
        elevation: 5,
        zIndex: 11,
    },
    ingredientInputRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-start',
    },
    ingredientInputContainer: {
        flexDirection: 'column',
        gap: 2,
        marginBlockEnd: 8,
    },
    ingredientListItemInner: {
        flexDirection: 'row',
        gap: 8,
        flex: 1,
        alignItems: 'center',
    },
    listEmpty: {
        padding: 20,
        alignItems: 'center',
    },
    listEmptyText: {
        textAlign: 'center',
        marginBottom: 16,
    },
    snackbar: {
        position: 'absolute',
        bottom: 120,
        left: 16,
        right: 16,
        backgroundColor: colors.notification,
        borderRadius: 4,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
        zIndex: 1000,
        gap: 12,
    },
    snackbarSuccess: {
        backgroundColor: colors.success,
    },
    snackbarError: {
        backgroundColor: colors.error,
    },
    snackbarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    snackbarText: {
        color: '#fff',
        flex: 1,
    },
    snackbarActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    snackbarActionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    languageSwitcher: {
        position: 'absolute',
        bottom: 10,
        right: 20,
    },
    languageButton: {
        padding: 4,
    }
});

export const darkStyles = StyleSheet.create({
    ...styles,
    app: {
        ...styles.app,
        backgroundColor: colors.background.dark,
        color: colors.textPrimary.dark,
    },
    title: {
        ...styles.title,
        color: colors.textPrimary.dark,
    },
    subTitle: {
        ...styles.subTitle,
        color: colors.textPrimary.dark,
    },
    text: {
        ...styles.text,
        color: colors.textPrimary.dark,
    },
    listItem: {
        ...styles.listItem,
        backgroundColor: colors.surface1.dark,
    },
    listItemText: {
        ...styles.listItemText,
        color: colors.textPrimary.dark,
    },
    form: {
        ...styles.form,
        backgroundColor: colors.surface1.dark,
        borderColor: colors.border.dark,
    },
    input: {
        ...styles.input,
        backgroundColor: colors.surface2.dark,
        borderColor: colors.border.dark,
        color: colors.textPrimary.dark,
    },
    textArea: {
        ...styles.textArea,
        backgroundColor: colors.surface2.dark,
        borderColor: colors.border.dark,
        color: colors.textPrimary.dark,
    },
    pickerDropdown: {
        ...styles.pickerDropdown,
        backgroundColor: colors.surface2.dark,
        borderColor: colors.border.dark,
        color: colors.textPrimary.dark,
    },
    modalContent: {
        ...styles.modalContent,
        backgroundColor: colors.surface1.dark,
    },
    modalHeader: {
        ...styles.modalHeader,
        borderBottomColor: colors.border.dark,
    },
    modalText: {
        ...styles.modalText,
        color: colors.textPrimary.dark,
    },
    modalBullet: {
        ...styles.modalBullet,
        color: colors.textPrimary.dark,
    },
    slideMenuToggleWrapper: {
        ...styles.slideMenuToggleWrapper,
        backgroundColor: colors.surface1.dark,
    },
});
