// Packages
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Styles
import style from "../styles/App.module.css";

// Components
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Contact from "./layout/Contact";
import Loading from "./layout/Loading";
import Alert from "./layout/Alert";
import Model from "./layout/Model";

// Contexts
import { AppProvider } from "../contexts/AppContext";

// Utils



// Variables
const defaultAlert = {
	message: "",
	error: false,
};

  
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
				<div className={style.app} data-testid="app">
					{model && <Model onModel={setModel} model={model} />}
					<AppProvider
						onUser={onUser}
						accessToken={accessToken}
						onModel={setModel}
						onAlert={handleAlert}
						handleVerifyTokenExpire={handleTokenExpire}
						handleExChangeToken={handleExChangeToken}
					>
						<div className={style.headerBar}>
							<Header
								user={user}
								darkTheme={darkTheme}
								handleSwitchColorTheme={onColorTheme}
							/>
							{alert.message !== "" && (
								<Alert
									onCloseAlert={handleCloseAlert}
									alert={alert}
								/>
							)}
						</div>
					</AppProvider>

					<div className={style.container}>
						<main>
							<Outlet
								context={{
									user,
									error,
									accessToken,
									handleVerifyTokenExpire: handleTokenExpire,
									handleExChangeToken: handleExChangeToken,
									onModel: setModel,
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
