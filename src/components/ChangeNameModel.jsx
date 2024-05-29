import PropTypes from "prop-types";

import style from "../styles/ChangeNameModel.module.css";
import { settings } from "../styles/Settings.module.css";
import form from "../styles/utils/form.module.css";
import { blur } from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

const ChangeNameModel = ({ username, userId, handleCloseModel }) => {
	const inputError = false;

	const handelSubmit = e => {
		e.preventDefault();
		const isVerify = false;
		const formData = new FormData(e.target);
		const formProps = Object.fromEntries(formData);

		console.log(formProps);

		isVerify && console.log("Post request", JSON.stringify(formProps));
		isVerify && e.target.reset();
	};

	return (
		<div className={blur} onClick={handleCloseModel} data-close>
			<div className={`${settings} ${style.model}`}>
				<button type="button" className={button.closeBtn} data-close>
					<span className={`${image.icon} ${button.close}`} />
				</button>
				<form className={form.content} onSubmit={handelSubmit}>
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
					<button className={button.success} type="submit">
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
