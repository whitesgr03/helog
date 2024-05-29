import PropTypes from "prop-types";

import style from "../styles/DeleteAccountModel.module.css";
import { settings } from "../styles/Settings.module.css";
import { blur } from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

const DeleteAccountModel = ({ userId, handleCloseModel }) => {
	return (
		<div className={blur} onClick={handleCloseModel} data-close>
			<div className={`${settings} ${style.model}`}>
				<button type="button" className={button.closeBtn} data-close>
					<span className={`${image.icon} ${button.close}`} />
				</button>
				<span className={style.title}>Delete Account</span>
				<span className={style.content}>
					Do you really want to delete?
				</span>
				<div className={style.buttonWrap}>
					<button
						className={`${button.content} ${style.cancelBtn}`}
						data-close
					>
						Cancel
					</button>
					<button className={button.error}>Delete</button>
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
