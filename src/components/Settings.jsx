import style from "../styles/Settings.module.css";

import PropTypes from "prop-types";

const Settings = ({ user }) => {
	// const user = useContext(userContext);
	const activeChangeName = false;
	const activeDeleteAccount = false;
	return (
		<div className={model}>
			<div className={style.settings}>
				<button className={`icon ${style.closeBtn}`} />
				<div className={style.header}>
					<span>Settings</span>
				</div>
				<div>
					<div className={style.avatarWrap}>
						<div className={style.avatar}>
							{user.name && user.name.charAt(0).toUpperCase()}
						</div>
					</div>
					<ul className={style.list}>
						<li>
							<strong className={style.title}>Name</strong>

							<span>{user.name}</span>
							<button>Change name</button>
						</li>
						<li>
							<strong className={style.title}>Email</strong>
							<span>{user.email}</span>
						</li>
					</ul>
					<div className={style.delete}>
						<strong className={style.title}>Delete</strong>
						<button>Delete account</button>
					</div>
				</div>
			</div>
		</div>
	);
};

Settings.propTypes = {
	user: PropTypes.object,
};

export default Settings;