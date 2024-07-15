// Packages
import { useState } from "react";
import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/DeleteAccountModel.module.css";
import { settings } from "../../styles/layout/Settings.module.css";
import { blurWindow } from "../../styles/utils/bgc.module.css";
import button from "../../styles/utils/button.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import Error from "./Error";

// Contexts
import { AppContext } from "../../contexts/AppContext";

// Utils
import { deleteUser } from "../../utils/handleUser";

const DeleteAccountModel = ({ handleCloseModel, handleCloseSettings }) => {
	const [error, setError] = useState(null);
	const {
		setUser,
		accessToken,
		refreshToken,
		handleVerifyTokenExpire,
		handleExChangeToken,
	} = AppContext();

	const handleDelete = async () => {
		const isTokenExpire = await handleVerifyTokenExpire(accessToken);
		isTokenExpire && handleExChangeToken(refreshToken);

		const result = await deleteUser(accessToken);

		const handleLogout = () => {
			window.location.replace("http://localhost:3000/account/logout");
			localStorage.removeItem("heLog.login-exp");
			setUser(null);
			handleCloseSettings();
			handleCloseModel();
		};

		result.success ? handleLogout() : setError(result.message);
	};

	const handleClick = e => e.target.dataset.closeModel && handleCloseModel();

	return (
		<div
			className={blurWindow}
			onClick={handleClick}
			data-close-model
			data-testid={"blurBgc"}
		>
			<div className={`${settings} ${style.model}`}>
				<button
					type="button"
					className={button.closeBtn}
					data-close-model
				>
					<span className={`${image.icon} ${button.close}`} />
				</button>

				<span className={style.title}>Delete Account</span>
				<span className={style.content}>
					Do you really want to delete?
				</span>
				<div className={style.buttonWrap}>
					<button className={button.cancel} data-close-model>
						Cancel
					</button>
					<button className={button.error} onClick={handleDelete}>
						Delete
					</button>
				</div>
				{error && (
					<div
						className={blurWindow}
						onClick={handleClick}
						data-close-model
						data-testid={"blurBgc"}
					>
						<div className={`${settings} ${style.model}`}>
							<button
								type="button"
								className={button.closeBtn}
								data-close-model
							>
								<span
									className={`${image.icon} ${button.close}`}
								/>
							</button>
							<Error message={error} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

DeleteAccountModel.propTypes = {
	handleCloseModel: PropTypes.func,
	handleCloseSettings: PropTypes.func,
};

export default DeleteAccountModel;
