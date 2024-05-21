import style from "../styles/Header.module.css";
import { sun, moon } from "../styles/Dropdown.module.css";

import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Dropdown from "./Dropdown";

const Header = ({ user }) => {
	const darkTheme = true;
	// const user = useContext(userContext);
	const active = true;
	return (
		<header className={`${darkTheme ? style.dark : ""} ${style.header} `}>
			<Link to="/" className={style.logo}>
				<h1>HeLog</h1>
			</Link>
			<nav>
				<ul className={style.list}>
					{user.isAdmin && (
						<li>
							<Link to="/">
								<span
									className={`${image.icon} ${style.pencil}`}
								/>
								Write
							</Link>
						</li>
					)}
					<li>
						<button
							className={`${darkTheme ? button.dark : ""} ${
								button.theme
							}`}
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
						<button>
							<span
								className={`${image.icon} ${style.account}`}
							/>
							Account
						</button>
					</li>
				</ul>
			</nav>
			{active && <Dropdown user={user} />}
		</header>
	);
};
Header.propTypes = {
	user: PropTypes.object,
};

export default Header;
