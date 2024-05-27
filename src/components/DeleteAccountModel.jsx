import { useContext } from "react";
import PropTypes from "prop-types";

import style from "../styles/DeleteAccountModel.module.css";
import { dark as settingsDark, settings } from "../styles/Settings.module.css";
import { blur } from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import { DarkThemeContext } from "../contexts/DarkThemeContext";

const DeleteAccountModel = ({ userId, handleCloseModel }) => {
	const [darkTheme] = useContext(DarkThemeContext);
	return (
		<div className={blur} onClick={handleCloseModel} data-close>
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
					data-close
				>
					<span className={`${image.icon} ${button.close}`} />
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
						data-close
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
	handleCloseModel: PropTypes.func,
};

export default DeleteAccountModel;
