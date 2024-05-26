import style from "../styles/ChangeNameModel.module.css";
import { dark as settingsDark, settings } from "../styles/Settings.module.css";

import form from "../styles/utils/form.module.css";
import { blur } from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import PropTypes from "prop-types";

const ChangeNameModel = ({ username, userId, handleCloseModel }) => {
	const darkTheme = false;
	const inputError = false;
	return (
		<div className={blur}
			onClick={handleCloseModel}
		>
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
				<form
					className={`${darkTheme ? form.dark : ""} ${form.content}`}
				>
					<div>
						<label
							htmlFor="changeName"
							className={`${inputError ? form.error : ""}`}
						>
							Change Name
							<input id="changeName" type="text" name="name" />
						</label>
						<span>This is a placeholder</span>
					</div>
					<button
						className={`${darkTheme ? button.dark : ""} ${
							button.success
						}`}
						type="submit"
					>
						Save
					</button>
				</form>
			</div>
		</div>
	);
};

ChangeNameModel.propTypes = {
	username: PropTypes.string,
	userId: PropTypes.string,
	handleCloseModel: PropTypes.func,
};

export default ChangeNameModel;
