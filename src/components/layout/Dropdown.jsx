// Packages
import { useState } from "react";
import PropTypes from "prop-types";
import { useOutletContext } from "react-router-dom";

// Styles
import style from "../../styles/layout/Dropdown.module.css";
import button from "../../styles/utils/button.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import Settings from "./Settings";

// Utils
import handleGetAuthCode from "../../utils/handleGetAuthCode.js";

const Dropdown = ({
	user,
	darkTheme,
	handleCloseDropdown,
	handleSwitchColorTheme,
}) => {
	const { setUser } = useOutletContext();
	const [activeSettings, setActiveSettings] = useState(false);

	const handleLogout = async () => {
		window.location.replace(
			`${import.meta.env.VITE_RESOURCE_ORIGIN}/account/logout`
		);
		localStorage.removeItem("heLog.login-exp");
		setUser(null);
		handleCloseDropdown();
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
					{user.name}
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
	handleCloseDropdown: PropTypes.func,
	handleSwitchColorTheme: PropTypes.func,
};

export default Dropdown;
