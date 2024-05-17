import style from "../styles/Dropdown.module.css";
import { icon } from "../styles/image.module.css";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Settings from "./Settings";

const Dropdown = ({ user }) => {
	// const darkTheme = useContext(themeContext)
	// const user = useContext(userContext);
	const active = false;
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
					<div className={style.colorThemeToggle}>
						{/* {darkTheme ? (
							<>
								<span className={`${icon} ${style.moon}`} />
								Dark mode
							</>
						) : ( */}
						<>
							<span className={`${icon} ${style.sun}`} />
							Light mode
						</>
						{/* )} */}
						<button>
							<div/>
						</button>
					</div>
				</li>
				{user && (
					<li>
						<button>
							<span className={`${icon} ${style.settings}`} />
							Settings
						</button>
					</li>
				)}
				<li>
					{user ? (
						<button>
							<span className={`${icon} ${style.logout}`} />
							Logout
						</button>
					) : (
						<Link to="/users/login">
							<span className={`${icon} ${style.login}`} />
							Login
						</Link>
					)}
				</li>
			</ul>
			{active && <Settings user={user} />}
		</div>
	);
};

Dropdown.propTypes = {
	user: PropTypes.object,
};

export default Dropdown;
