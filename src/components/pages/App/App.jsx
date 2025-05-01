// Packages
import { useState, useEffect } from 'react';
import { Outlet, useSearchParams, ScrollRestoration } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Styles
import 'normalize.css';
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Alert } from './Alert';
import { Modal } from './Modal';
import { Loading } from '../../utils/Loading';
import { Error } from '../../utils/Error/Error';

// Utils
import { queryUserInfOption } from '../../../utils/queryOptions';

export const App = () => {
	const [darkTheme, setDarkTheme] = useState(null);
	const [alert, setAlert] = useState([]);
	const [modal, setModal] = useState(null);

	const [searchParams] = useSearchParams();

	const {
		isPending,
		isError,
		data: user,
		error,
		refetch,
	} = useQuery(queryUserInfOption);

	const handleColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	const handleAlert = ({ message, error, delay }) => {
		const newAlert = {
			message,
			error,
			delay,
		};
		setAlert(alert.length < 2 ? alert.concat(newAlert) : [newAlert]);
	};

	const handleActiveModal = ({ component, clickToClose = true }) => {
		document.body.removeAttribute('style');
		component && (document.body.style.overflow = 'hidden');
		component ? setModal({ component, clickToClose }) : setModal(null);
	};

	useEffect(() => {
		const getColorTheme = () => {
			const themeParams = searchParams.get('theme');
			const darkScheme = localStorage.getItem('darkTheme');
			const browserDarkScheme =
				window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;

			const theme =
				themeParams !== null
					? themeParams
					: darkScheme !== null
						? darkScheme
						: String(browserDarkScheme);

			localStorage.setItem('darkTheme', theme);
			setDarkTheme(theme === 'true');
		};
		darkTheme === null && getColorTheme();
	}, [darkTheme, searchParams]);

	return (
		<div
			className={`${darkTheme ? 'dark' : ''} ${styles.app}`}
			data-testid="app"
		>
			<ScrollRestoration getKey={location => location.key} />
			{isPending ? (
				<Loading text={'Loading...'} />
			) : isError && error.message !== '404' ? (
				<Error onReGetUser={refetch} />
			) : (
				<>
					{modal && (
						<Modal
							onActiveModal={handleActiveModal}
							clickToClose={modal.clickToClose}
						>
							{modal.component}
						</Modal>
					)}
					<div className={styles['header-bar']}>
						<Header
							user={user?.data}
							darkTheme={darkTheme}
							onAlert={handleAlert}
							onColorTheme={handleColorTheme}
							onActiveModal={handleActiveModal}
						/>
						<Alert alert={alert} onAlert={setAlert} />
					</div>
					<div className={styles.container}>
						<main>
							<Outlet
								context={{
									user: user?.data,
									onActiveModal: handleActiveModal,
									onAlert: handleAlert,
								}}
							/>
						</main>
						<Footer />
					</div>
				</>
			)}
		</div>
	);
};
