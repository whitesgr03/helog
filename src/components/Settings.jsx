import style from "../styles/Settings.module.css";

import PropTypes from "prop-types";

const Settings = ({ userId, userName, userEmail }) => {
	return (
		<div className={style.settings}>
			<div className={style.header}>
				<span>Settings</span>
				<button className={`icon ${style.closeBtn}`}></button>
			</div>
			<div>
				<div className={style.avatarWrap}>
					<div className={style.avatar}>
						{userName && userName.charAt(0).toUpperCase()}
					</div>
				</div>
				<ul className={style.list}>
					<li>
						<strong className={style.title}>Name</strong>

						<span>{userName}</span>
						<button>Change name</button>
					</li>
					<li>
						<strong className={style.title}>Email</strong>
						<span>{userEmail}</span>
					</li>
				</ul>
				<div className={style.delete}>
					<strong className={style.title}>Delete</strong>
					<button>Delete account</button>
				</div>
			</div>
		</div>
	);
};

Settings.propTypes = {
	userId: PropTypes.string,
	userName: PropTypes.string,
	userEmail: PropTypes.string,
};

export default Settings;
