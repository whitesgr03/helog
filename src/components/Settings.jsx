import { useState } from "react";
import style from "../styles/Settings.module.css";

import blur from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import PropTypes from "prop-types";

import ChangeNameModel from "./ChangeNameModel";
import DeleteAccountModel from "./DeleteAccountModel";

const defaultModel = {
	changeName: false,
	deleteAccount: false,
};
	const darkTheme = false;

	const [model, setModel] = useState(defaultModel);

	return (
		<div className={blur.bgc}>
			<div className={`${darkTheme ? style.dark : ""} ${style.settings}`}>
				<button
					className={`${darkTheme ? button.dark : ""} ${
						button.closeBtn
					}`}
				>
					<span className={`${image.icon} ${button.close}`} />
				</button>
				<div className={style.header}>Settings</div>
				<div className={style.container}>
					<div className={style.avatarWrap}>
						<div className={style.avatar}>
							{user.name && user.name.charAt(0).toUpperCase()}
						</div>
					</div>
					<ul className={style.list}>
						<li>
							<strong className={style.title}>Name</strong>

							<span>{user.name}</span>
							<button className={style.changeBtn}>
								Change name
							</button>
						</li>
						<li>
							<strong className={style.title}>Email</strong>
							<span>{user.email}</span>
						</li>
						<li>
							<strong className={style.title}>Delete</strong>
							<button className={style.deleteBtn}>
								Delete account
							</button>
						</li>
					</ul>
				</div>
				{activeChangeName && <ChangeNameModel username={user.name} />}
				{activeDeleteAccount && <DeleteAccountModel userId={user.id} />}
			</div>
		</div>
	);
};

Settings.propTypes = {
	user: PropTypes.object,
};

export default Settings;
