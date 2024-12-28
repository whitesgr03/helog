// Packages
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Styles
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Contact } from '../../layout/Contact';
import { Alert } from './Alert';
import { Modal } from './Modal';
import { CreateUsername } from './CreateUsername';
import { Loading } from '../../utils/Loading';

// Utils
import { getUser } from '../../../utils/handleUser';

// Variables
const defaultAlert = {
	message: '',
	error: false,
};

export const App = () => {
	const [user, setUser] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState(defaultAlert);
	const [modal, setModal] = useState(null);

	const handleColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	const handleAlert = ({ message, error = false }) =>
		setAlert({ message, error });
	const handleCloseAlert = () => setAlert(defaultAlert);

	const handleActiveModal = ({ component, clickToClose = true }) => {
		document.body.removeAttribute('style');
		component && (document.body.style.overflow = 'hidden');
		component ? setModal({ component, clickToClose }) : setModal(null);
	};

	useEffect(() => {
		const getColorTheme = () => {
			const darkScheme = localStorage.getItem('darkTheme');

			const browserDarkScheme =
				window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;

			darkScheme === null &&
				localStorage.setItem('darkTheme', browserDarkScheme);

			setDarkTheme(
				darkScheme === null ? browserDarkScheme : darkScheme === 'true',
			);
		};
		getColorTheme();
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetUser = async () => {
			const result = await getUser({ signal });

			const handleResult = () => {
				result.success && setUser(result.data);
				setLoading(false);
			};

			result && handleResult();
		};
		handleGetUser();
		return () => controller.abort();
	}, []);

	useEffect(() => {
		user &&
			!user.username &&
			handleActiveModal({
				component: (
					<CreateUsername
						onActiveModal={handleActiveModal}
						onUser={setUser}
						onAlert={handleAlert}
					/>
				),
				clickToClose: false,
			});
	}, [user]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div
					className={`${darkTheme ? 'dark' : ''} ${styles.app}`}
					data-testid="app"
				>
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
							user={user}
							darkTheme={darkTheme}
							onUser={setUser}
							onAlert={handleAlert}
							onColorTheme={handleColorTheme}
							onActiveModal={handleActiveModal}
						/>
						{alert.message !== '' && (
							<Alert onCloseAlert={handleCloseAlert} alert={alert} />
						)}
					</div>
					<div className={styles.container}>
						<main>
							<Outlet
								context={{
									user,
									onUser: setUser,
									onActiveModal: handleActiveModal,
									onAlert: handleAlert,
								}}
							/>
						</main>
						<Contact />
						<Footer />
					</div>
				</div>
			)}
		</>
	);
};
