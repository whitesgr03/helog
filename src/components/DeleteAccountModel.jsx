import { useState } from "react";
import PropTypes from "prop-types";

import style from "../styles/DeleteAccountModel.module.css";
import { settings } from "../styles/Settings.module.css";
import { blur } from "../styles/utils/blur.module.css";
import button from "../styles/utils/button.module.css";
import image from "../styles/utils/image.module.css";

import { AppContext } from "../contexts/AppContext";

import handleFetch from "../utils/handleFetch";
import Error from "./Error";

const DELETE_USER_URL = "http://localhost:3000/blog/users";

const DeleteAccountModel = ({
	userId,
	handleCloseModel,
	handleCloseSettings,
}) => {
	const [error, setError] = useState(null);
	const { token, setToken } = AppContext();

	const handleDelete = async () => {
		const fetchOption = {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		try {
			const result = await handleFetch(`${DELETE_USER_URL}/${userId}`, {
				...fetchOption,
			});

			const handleSetToken = () => {
				localStorage.removeItem("token");
				setToken(null);
				handleCloseSettings();
				handleCloseModel();
			};

			result.success ? handleSetToken() : setError(result.message);
		} catch (err) {
			setError(err);
		}
	};

	const handleClick = e => e.target.dataset.closeModel && handleCloseModel();

	return (
		<div
			className={blur}
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
					<button
						className={`${button.content} ${style.cancelBtn}`}
						data-close-model
					>
						Cancel
					</button>
					<button className={button.error} onClick={handleDelete}>
						Delete
					</button>
				</div>
				{error && (
					<div
						className={blur}
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
	userId: PropTypes.string,
	handleCloseModel: PropTypes.func,
	handleCloseSettings: PropTypes.func,
};

export default DeleteAccountModel;
