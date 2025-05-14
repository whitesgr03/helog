import { createContext, useContext } from 'react';

export const AlertContext = createContext([]);

export const ModalContext = createContext({});

export const AppDataAPIContext = createContext({});

export const reducer = (state, action) => {
	switch (action.type) {
		case 'updatedAlert':
			return {
				...state,
				alert:
					action.alert.length === 0 || state.alert.length >= 2
						? action.alert
						: state.alert.concat(action.alert),
			};
		case 'updatedModal':
			document.body.removeAttribute('style');
			action.modal.component && (document.body.style.overflow = 'hidden');
			return { ...state, modal: { ...state.modal, ...action.modal } };
	}
};

export const initialData = {
	alert: [],
	modal: { component: null, clickBgToClose: true },
};

export const useAlert = () => useContext(AlertContext);
export const useModal = () => useContext(ModalContext);
export const useAppDataAPI = () => useContext(AppDataAPIContext);
