import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import style from "../styles/Dropdown.module.css";
import Settings from "./Settings";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import { UserContext } from "../contexts/UserContext";

const Dropdown = ({
	handleCloseDropdown,
	darkTheme,
	handleSwitchColorTheme,
}) => {
	const [activeSettings, setActiveSettings] = useState(false);
	const { user, setToken } = UserContext();

	const handleLogout = () => {
		localStorage.removeItem("token");
		setToken(null);
		handleCloseDropdown();
	};

	const handleActiveSetting = () => {
		setActiveSettings(true);
	};
	const handleCloseSetting = e => {
		!e
			? setActiveSettings(false)
			: e.target.dataset.closeSetting && setActiveSettings(false);
	};

	return (
		<div className={style.dropdown}>
			{user && (
				<div className={style.profile}>
					<div className={style.avatar}>
						{user.name && user.name.charAt(0).toUpperCase()}
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
						<button onClick={handleActiveSetting}>
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
						<Link to="/users/login" onClick={handleCloseDropdown}>
							<span className={`${image.icon} ${style.login}`} />
							Login
						</Link>
					)}
				</li>
			</ul>
			{activeSettings && (
				<Settings handleCloseSetting={handleCloseSetting} />
			)}
		</div>
	);
};

Dropdown.propTypes = {
	setToken: PropTypes.func,
	setUser: PropTypes.func,
	handleCloseDropdown: PropTypes.func,
	darkTheme: PropTypes.bool,
	handleSwitchColorTheme: PropTypes.func,
};

export default Dropdown;
