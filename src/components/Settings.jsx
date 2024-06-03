import { useState } from "react";
import PropTypes from "prop-types";

import style from "../styles/Settings.module.css";
import { blur } from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import ChangeNameModel from "./ChangeNameModel";
import DeleteAccountModel from "./DeleteAccountModel";

import { UserContext } from "../contexts/UserContext";

const defaultModel = {
	changeName: false,
	deleteAccount: false,
};
const Settings = ({ handleCloseSetting }) => {
	const [model, setModel] = useState(defaultModel);
	const { user } = UserContext();

	const handleActiveModel = e => {
		const { active } = e.target.dataset;
		active && setModel({ ...model, [active]: true });
	};

	const handleCloseModel = e => {
		!e
			? setModel(defaultModel)
			: e.target.dataset.close && setModel(defaultModel);
	};

	return (
		<div className={blur} onClick={handleCloseSetting} data-close-setting>
			<div className={style.settings} onClick={handleActiveModel}>
				<button
					type="button"
					className={button.closeBtn}
					data-close-setting
				>
					<span className={`${image.icon} ${button.close}`} />
				</button>
				<div className={style.header}>Settings</div>
				<div className={style.container}>
					<div className={style.avatarWrap}>
						<div className={style.avatar}>
							{user?.name && user.name.charAt(0).toUpperCase()}
						</div>
					</div>
					<ul className={style.list}>
						<li>
							<strong className={style.title}>Name</strong>
							{user?.name && <span>{user.name}</span>}
							<button
								className={style.changeBtn}
								data-active="changeName"
							>
								Change name
							</button>
						</li>
						<li>
							<strong className={style.title}>Email</strong>
							{user?.email && <span>{user.email}</span>}
						</li>
						<li>
							<strong className={style.title}>Delete</strong>
							<button
								className={style.deleteBtn}
								data-active="deleteAccount"
							>
								Delete account
							</button>
						</li>
					</ul>
				</div>
				{model.changeName && (
					<ChangeNameModel handleCloseModel={handleCloseModel} />
				)}
				{model.deleteAccount && (
					<DeleteAccountModel
						handleCloseModel={handleCloseModel}
						handleCloseSetting={handleCloseSetting}
					/>
				)}
			</div>
		</div>
	);
};

Settings.propTypes = {
	handleCloseSetting: PropTypes.func,
};

export default Settings;
