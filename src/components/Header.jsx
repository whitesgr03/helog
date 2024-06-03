import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import style from "../styles/Header.module.css";
import { sun, moon } from "../styles/Dropdown.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";
import { transparent } from "../styles/utils/blur.module.css";

import { UserContext } from "../contexts/UserContext";

import Dropdown from "./Dropdown";

const Header = ({ darkTheme, handleSwitchColorTheme }) => {
	const [activeDropdown, setActiveDropdown] = useState(false);
	const { user } = UserContext();

	const handleActiveDropdown = () => {
		setActiveDropdown(!activeDropdown);
	};
	const handleCloseDropdown = () => {
		setActiveDropdown(false);
	};
	return (
		<>
			<header className={style.header}>
				<Link
					to="/"
					className={style.logo}
					onClick={handleCloseDropdown}
				>
					<h1>HeLog</h1>
				</Link>
				<nav>
					<ul className={style.list}>
						{user?.isAdmin && (
							<li>
								<Link to="/">
									<span
										className={`${image.icon} ${style.pencil}`}
									/>
									Write
								</Link>
							</li>
						)}
						<li className={style.toggleBtn}>
							<button
								className={button.theme}
								onClick={handleSwitchColorTheme}
							>
								<div className={style.switch}>
									<span
										className={`${image.icon} ${
											darkTheme ? moon : sun
										}`}
									/>
									<div>
										<div />
									</div>
								</div>
								<span>{darkTheme ? "Dark" : "Light"} mode</span>
							</button>
						</li>
						<li>
							<button onClick={handleActiveDropdown}>
								<span
									className={`${image.icon} ${style.account}`}
								/>
								Account
							</button>
						</li>
					</ul>
				</nav>
				{activeDropdown && (
					<Dropdown
						darkTheme={darkTheme}
						handleSwitchColorTheme={handleSwitchColorTheme}
						handleCloseDropdown={handleCloseDropdown}
					/>
				)}
			</header>
			{activeDropdown && (
				<div className={transparent} onClick={handleCloseDropdown} />
			)}
		</>
	);
};
Header.propTypes = {
	darkTheme: PropTypes.bool,
	handleSwitchColorTheme: PropTypes.func,
};

export default Header;
