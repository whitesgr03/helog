import style from "../styles/Header.module.css";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Header = ({
	isAdmin,
}) => {
	return (
		<header className={style.header}>
			<Link to="/" className={style.logo}>
				<h1>HeLog</h1>
			</Link>
			<nav>
				<ul className={style.list}>
					{isAdmin && (
						<li>
							<Link to="/" className={style.link}>
								<span className={`icon ${style.pencil}`} />
								Write
							</Link>
						</li>
					)}
					<li>
						<button className={style.button}>
							<span className={`icon ${style.account}`} />
							Account
						</button>
					</li>
				</ul>
			</nav>
			<Dropdown />
		</header>
	);
};
Header.propTypes = {
	isAdmin: PropTypes.bool,
};

export default Header;
