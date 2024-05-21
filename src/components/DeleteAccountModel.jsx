import style from "../styles/DeleteAccountModel.module.css";
import { dark as settingsDark, settings } from "../styles/Settings.module.css";

import blur from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import PropTypes from "prop-types";

const DeleteAccountModel = ({ userId }) => {
	const darkTheme = true;
	return (
		<div className={blur.bgc}>
			<div
				className={`${
					darkTheme ? `${style.dark} ${settingsDark}` : ""
				} ${settings} ${style.model}`}
			>
				<button
					type="button"
					className={`${darkTheme ? button.dark : ""} ${
						button.closeBtn
					}`}
				>
					<span className={`${image.icon} ${button.close}`}></span>
				</button>
				<span className={style.title}>Delete Account</span>
				<span className={style.content}>
					Do you really want to delete?
				</span>
				<div className={style.buttonWrap}>
					<button
						className={`${darkTheme ? button.dark : ""} ${
							button.content
						} ${style.cancelBtn}`}
					>
						Cancel
					</button>
					<button
						className={`${darkTheme ? button.dark : ""} ${
							button.error
						}`}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

DeleteAccountModel.propTypes = {
	userId: PropTypes.string,
};

export default DeleteAccountModel;
