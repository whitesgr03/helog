// Packages
import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// Styles
import style from "../../styles/layout/Dropdown.module.css";
import button from "../../styles/utils/button.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import Settings from "./Settings";

// Utils
import handleGetAuthCode from "../../utils/handleGetAuthCode.js";

const Dropdown = ({ user, darkTheme, handleSwitchColorTheme }) => {
	const [activeSettings, setActiveSettings] = useState(false);
	const location = useLocation();

	const handleLogout = async () => {
		localStorage.removeItem("heLog.login-exp");
		localStorage.setItem("heLog.logout-lastPath", location.pathname);
		window.location.replace(
			`${import.meta.env.VITE_RESOURCE_URL}/account/logout`
		);
	};

	const handleLogin = async () => await handleGetAuthCode();

	const handleActiveSettings = () => setActiveSettings(true);
	const handleCloseSettings = () => setActiveSettings(false);
	return (
		<div className={style.dropdown}>
			{user?.name && (
				<div className={style.profile}>
					<div className={style.avatar}>
						{user.name.charAt(0).toUpperCase()}
					</div>
					<span title={user.name}>{user.name}</span>
				</div>
			)}
			<ul>
				<li>
					<button
						className={button.theme}
						onClick={handleSwitchColorTheme}
					>
						<span
							className={`${image.icon} ${
								darkTheme ? style.moon : style.sun
							}`}
						/>
						{darkTheme ? "Dark" : "Light"} mode
						<div>
							<div />
						</div>
					</button>
				</li>
				{user && (
					<li>
						<button onClick={handleActiveSettings}>
							<span
								className={`${image.icon} ${style.settings}`}
							/>
							Settings
						</button>
					</li>
				)}
				<li>
					{user ? (
						<button onClick={handleLogout}>
							<span className={`${image.icon} ${style.logout}`} />
							Logout
						</button>
					) : (
						<button onClick={handleLogin}>
							<span className={`${image.icon} ${style.login}`} />
							Login
						</button>
					)}
				</li>
			</ul>
			{activeSettings && (
				<Settings
					user={user}
					handleCloseSettings={handleCloseSettings}
				/>
			)}
		</div>
	);
};

Dropdown.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	handleSwitchColorTheme: PropTypes.func,
};

export default Dropdown;
