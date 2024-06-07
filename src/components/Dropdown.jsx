import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import style from "../styles/Dropdown.module.css";
import Settings from "./Settings";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import { AppContext } from "../contexts/AppContext";

const Dropdown = ({
	user,
	darkTheme,
	handleCloseDropdown,
	handleSwitchColorTheme,
}) => {
	const [activeSettings, setActiveSettings] = useState(false);
	const { setToken } = AppContext();

	const handleLogout = () => {
		localStorage.removeItem("token");
		setToken(null);
		handleCloseDropdown();
	};
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
						<Link to="/users/login" onClick={handleCloseDropdown}>
							<span className={`${image.icon} ${style.login}`} />
							Login
						</Link>
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
