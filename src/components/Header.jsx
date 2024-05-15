import style from "../styles/Header.module.css";

import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";

const Header = () => {
	return (
		<header className={style.header}>
			<Link to="/" className={style.logo}>
				<h1>HeLog</h1>
			</Link>
			<nav>
				<ul className={style.list}>
					<li>
						<Link to="/" className={style.link}>
							<span className={`icon ${style.pencil}`} />
							Write
						</Link>
					</li>
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

export default Header;
