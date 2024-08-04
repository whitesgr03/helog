// Packages
import { useState, useEffect, useCallback } from "react";
import {
	Outlet,
	useOutletContext,
	useLocation,
	useNavigate,
} from "react-router-dom";

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
import handleGetAuthCode from "../utils/handleGetAuthCode";
import { verifyToken, exChangeToken } from "../utils/handleToken";
import { getUser } from "../utils/handleUser";

// Variables
const defaultAlert = {
	message: "",
	error: false,
};

const App = () => {
	const {
		darkTheme,
		user,
		accessToken,
		refreshToken,
		error,
		ignore,
		onUser,
		onError,
		onAccessToken,
		onColorTheme,
	} = useOutletContext();
	const [model, setModel] = useState(null);
	const [loading, setLoading] = useState(true);
	const [alert, setAlert] = useState(defaultAlert);

	const location = useLocation();
	const navigate = useNavigate();

	const handleAlert = ({ message, error = false }) =>
		setAlert({ message, error });
	const handleCloseAlert = () => setAlert(defaultAlert);

	const handleTokenExpire = useCallback(async () => {
		const result = await verifyToken(accessToken);

		const handleError = message => {
			const errorMessage =
				message === "The request requires higher privileges.";

			errorMessage && localStorage.removeItem("heLog.login-exp");
			errorMessage && onUser(null);
			onError(message);
			navigate("/error");
		};

		return !result.success
			? result.message === "The token provided is expired."
				? true
				: handleError(result.message)
			: false;
	}, [accessToken, navigate, onError, onUser]);
	const handleExChangeToken = useCallback(async () => {
		const result = await exChangeToken(refreshToken);

		const handleError = message => {
			const errorMessage =
				message === "The request requires higher privileges.";

			errorMessage && localStorage.removeItem("heLog.login-exp");
			errorMessage && onUser(null);

			onError(message);
			navigate("/error");
		};

		const handleSuccess = () => {
			onAccessToken(result.data.access_token);
			return result.data.access_token;
		};

		return result.success ? handleSuccess() : handleError(result.message);
	}, [onAccessToken, refreshToken, navigate, onError, onUser]);

	useEffect(() => {
		sessionStorage.setItem("heLog.lastPath", location.pathname);
	}, [location]);
	useEffect(() => {
		let loginExp =
			JSON.parse(localStorage.getItem("heLog.login-exp")) ?? false;

		const isExpire = loginExp && Date.now() > +new Date(loginExp);

		const removeLoginState = () => {
			localStorage.removeItem("heLog.login-exp");
			loginExp = false;
		};

		isExpire && removeLoginState();

		loginExp ? !refreshToken && handleGetAuthCode() : setLoading(false);
	}, [refreshToken]);
	useEffect(() => {
		const handleGetUserInfo = async () => {
			ignore.current = true;

			const isTokenExpire = await handleTokenExpire();
			const newAccessToken =
				isTokenExpire && (await handleExChangeToken());

			const result = await getUser(newAccessToken || accessToken);

			const handleResult = () => {
				result.success ? onUser(result.data) : onError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};

		user
			? setLoading(false)
			: !ignore.current && accessToken && handleGetUserInfo();
	}, [
		user,
		ignore,
		accessToken,
		onUser,
		onError,
		handleTokenExpire,
		handleExChangeToken,
	]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className={style.app} data-testid="app">
					{model && <Model onModel={setModel} model={model} />}
					<AppProvider
						setUser={onUser}
						accessToken={accessToken}
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
