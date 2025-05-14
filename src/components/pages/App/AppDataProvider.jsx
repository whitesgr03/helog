import { useMemo, useReducer } from 'react';
import {
	AlertContext,
	ModalContext,
	AppDataAPIContext,
	reducer,
	initialData,
} from './AppContext';

export const AppDataProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialData);

	const api = useMemo(
		() => ({
			onAlert: alert =>
				dispatch({
					type: 'updatedAlert',
					alert,
				}),

			onModal: modal =>
				dispatch({
					type: 'updatedModal',
					modal,
				}),
		}),
		[],
	);

	return (
		<AppDataAPIContext.Provider value={api}>
			<ModalContext.Provider value={state.modal}>
				<AlertContext.Provider value={state.alert}>
					{children}
				</AlertContext.Provider>
			</ModalContext.Provider>
		</AppDataAPIContext.Provider>
	);
};
