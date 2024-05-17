import style from "../styles/Header.module.css";
import { icon } from "../styles/image.module.css";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Dropdown from "./Dropdown";

const Header = ({ user }) => {
	// const darkTheme = useContext(themContext)
	// const user = useContext(userContext);
	const active = false;
	return (
		// <header className={`${darkTheme ? style.dark : ""} ${style.header} `}>
		<header className={style.header}>
			<Link to="/" className={style.logo}>
				<h1>HeLog</h1>
			</Link>
			<nav>
				<ul className={style.list}>
					{user.isAdmin && (
						<li>
							<Link to="/">
								<span className={`${icon} ${style.pencil}`} />
								Write
							</Link>
						</li>
					)}
					<li>
						<button className={style.button}>
							<span className={`${icon} ${style.account}`} />
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
