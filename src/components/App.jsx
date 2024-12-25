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
