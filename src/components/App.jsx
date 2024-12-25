// Packages
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Styles
import style from "../styles/App.module.css";

// Components


// Utils



// Variables
const defaultAlert = {
	message: "",
	error: false,
};

	const [user, setUser] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);
	const [alert, setAlert] = useState(defaultAlert);



	const handleAlert = ({ message, error = false }) =>
		setAlert({ message, error });
	const handleCloseAlert = () => setAlert(defaultAlert);
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
					className={`${darkTheme ? 'dark' : ''} ${style.app}`}
					data-testid="app"
				>

            
					<div className={style.container}>
						<main>
							<Outlet
								context={{
									user,
									onUser: setUser,
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

export default App;
