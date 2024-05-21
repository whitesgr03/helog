import style from "../styles/ChangeNameModel.module.css";
import { dark as settingsDark, settings } from "../styles/Settings.module.css";

import form from "../styles/utils/form.module.css";
import blur from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

const ChangeNameModel = () => {
	const darkTheme = true;
	const inputError = false;
	// const user = useContext(userContext)
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

export default ChangeNameModel;
