import style from "../styles/Dropdown.module.css";

import { Link } from "react-router-dom";

const Dropdown = () => {
	const isLogin = false;

	const user = {
		name: "Name",
	};

	const darkMode = false;

	return (
		<div className={style.dropdown}>
			{isLogin && (
				<div className={style.profile}>
					<div className={style.avatar}>
						{user.name.charAt(0).toUpperCase()}
					</div>
					{user.name}
				</div>
			)}
			<ul>
				<li>
					<div className={style.colorThemeToggle}>
						{darkMode ? (
							<>
								<span className={`icon ${style.moon}`} />
								Dark mode
							</>
						) : (
							<>
								<span className={`icon ${style.sun}`} />
								Light mode
							</>
						)}
						<button className={style.switchWrap}>
							<div
								className={`${style.switch} ${
									darkMode ? style.switchActive : ""
								}`}
							/>
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
		</div>
	);
};

export default Dropdown;
