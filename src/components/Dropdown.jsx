import { useState } from "react";
import style from "../styles/Dropdown.module.css";
import Settings from "./Settings";

import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Dropdown = ({ user }) => {
	const [activeSettings, setActiveSettings] = useState(false);

	const darkTheme = false;

	const handleActiveSetting = () => {
		setActiveSettings(true);
	};
	const handleCloseSetting = e => {
		e.target.dataset.closeSetting && setActiveSettings(false);
	};

	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.dropdown}`}>
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
						className={`${darkTheme ? button.dark : ""} ${
							button.theme
						}`}
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
						<button>
							<span className={`${image.icon} ${style.logout}`} />
							Logout
						</button>
					) : (
						<Link to="/users/login">
							<span className={`${image.icon} ${style.login}`} />
							Login
						</Link>
					)}
				</li>
			</ul>
			{activeSettings && (
				<Settings user={user}
					handleCloseSetting={handleCloseSetting}
				/>
			)}
		</div>
	);
};

Dropdown.propTypes = {
	user: PropTypes.object,
};

export default Dropdown;
