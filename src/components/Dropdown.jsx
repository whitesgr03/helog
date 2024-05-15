import style from "../styles/Dropdown.module.css";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Settings from "./Settings";

const Dropdown = ({ isLogin, userName }) => {
	// const darkTheme = useContext(themeContext)
	const active = false;
	return (
		<div className={style.dropdown}>
			{isLogin && (
				<div className={style.profile}>
					<div className={style.avatar}>
						{userName && userName.charAt(0).toUpperCase()}
					</div>
					{userName}
				</div>
			)}
			<ul>
				<li>
					<div className={style.colorThemeToggle}>
						{/* {darkTheme ? (
							<>
								<span className={`icon ${style.moon}`} />
								Dark mode
							</>
						) : ( */}
						<>
							<span className={`icon ${style.sun}`} />
							Light mode
						</>
						{/* )} */}
						<button className={style.switchWrap}>
							<div className={style.switch} />
						</button>
					</div>
				</li>
				{isLogin && (
					<li>
						<button>
							<span className={`icon ${style.settings}`} />
							Settings
						</button>
					</li>
				)}
				<li>
					{isLogin ? (
						<button>
							<span className={`icon ${style.logout}`} />
							Logout
						</button>
					) : (
						<Link to="/users/login">
							<span className={`icon ${style.login}`} />
							Login
						</Link>
					)}
				</li>
			</ul>
			{active && <Settings />}
		</div>
	);
};

Dropdown.propTypes = {
	isLogin: PropTypes.bool,
	darkMode: PropTypes.bool,
	userName: PropTypes.string,
};

export default Dropdown;
