// Packages
import { useState } from "react";
import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/Settings.module.css";
import { blurWindow } from "../../styles/utils/bgc.module.css";
import button from "../../styles/utils/button.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import ChangeNameModel from "./ChangeNameModel";
import DeleteAccountModel from "./DeleteAccountModel";

// Variable
const defaultModel = {
	changeName: false,
	deleteAccount: false,
};
const Settings = ({ user, handleCloseSettings }) => {
	const [model, setModel] = useState(defaultModel);

	const handleActiveModel = e => {
		const { active } = e.target.dataset;
		active && setModel({ ...model, [active]: true });
	};

	const handleCloseModel = () => setModel(defaultModel);

	const handleClick = e => {
		e.target.dataset.closeSetting && handleCloseSettings();
	};

	return (
		<div
			className={blurWindow}
			onClick={handleClick}
			data-close-setting
			data-testid={"blurBgc"}
		>
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
							{user && user.name.charAt(0).toUpperCase()}
						</div>
					</div>
					<ul className={style.list}>
						<li>
							<strong className={style.title}>Name</strong>
							{user && <span>{user.name}</span>}
							<button
								className={style.changeBtn}
								data-active="changeName"
							>
								Change name
							</button>
						</li>
						<li>
							<strong className={style.title}>Email</strong>
							{user && <span>{user.email}</span>}
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
						handleCloseSettings={handleCloseSettings}
					/>
				)}
			</div>
		</div>
	);
};

Settings.propTypes = {
	user: PropTypes.object,
	handleCloseSettings: PropTypes.func,
};

export default Settings;
