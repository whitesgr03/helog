import PropTypes from "prop-types";

import style from "../styles/DeleteAccountModel.module.css";
import { settings } from "../styles/Settings.module.css";
import { blur } from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import { UserContext } from "../contexts/UserContext";

import handleFetch from "../utils/handleFetch";

const DELETE_USER_URL = "http://localhost:3000/blog/users";

const DeleteAccountModel = ({ handleCloseModel, handleCloseSetting }) => {
	const { user, token, setToken } = UserContext();

	const handleDelete = async () => {
		const fetchOption = {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		try {
			await handleFetch(`${DELETE_USER_URL}/${user._id}`, {
				...fetchOption,
			});
			localStorage.removeItem("token");
			setToken(null);
			handleCloseSetting();
		} catch (err) {
			console.error(err.cause);
		} finally {
			handleCloseModel();
		}
	};

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
					<button className={button.error} onClick={handleDelete}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

DeleteAccountModel.propTypes = {
	handleCloseModel: PropTypes.func,
	handleCloseSetting: PropTypes.func,
};

export default DeleteAccountModel;
