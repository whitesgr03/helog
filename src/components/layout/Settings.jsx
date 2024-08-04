// Packages
import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/Settings.module.css";
import { blurWindow } from "../../styles/utils/bgc.module.css";
import button from "../../styles/utils/button.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import { AppContext } from "../../contexts/AppContext";
import ChangeNameModel from "./ChangeNameModel";
import DeleteModel from "./DeleteModel";

// Utils
import { deleteUser } from "../../utils/handleUser";

// Variable
const models = {
	changeName: ChangeNameModel,
	deleteAccount: DeleteModel,
};
const Settings = ({ user, handleCloseSettings }) => {
	const {
		onModel,
		onAlert,
		onUser,
		accessToken,
		handleVerifyTokenExpire: onVerifyTokenExpire,
		handleExChangeToken: onExChangeToken,
	} = AppContext();

	const handleActiveModel = type => {
		const Model = models[type];

		let props = {
			onModel,
			onAlert,
			onUser,
			accessToken,
			onVerifyTokenExpire,
			onExChangeToken,
		};

		switch (type) {
			case "changeName":
				{
					props = { ...props, defaultValue: user.name };
				}
				break;
			case "deleteAccount":
				{
					const handleDelete = async () => {
						const isTokenExpire = await onVerifyTokenExpire();
						const newAccessToken =
							isTokenExpire && (await onExChangeToken());

						const result = await deleteUser(
							newAccessToken || accessToken
						);

						const handleLogout = () => {
							window.location.replace(
								`${
									import.meta.env.VITE_RESOURCE_URL
								}/account/logout`
							);
							localStorage.removeItem("heLog.login-exp");
							onUser(null);
							handleCloseSettings();
							onModel(null);
						};

						result.success
							? handleLogout()
							: onAlert({ message: result.message, error: true });
					};

					props = {
						...props,
						title: "Account",
						onDelete: handleDelete,
					};
				}
				break;
		}

		onModel(<Model {...props} />);
	};

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
			<div className={style.settings}>
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
								onClick={() => handleActiveModel("changeName")}
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
								onClick={() => handleActiveModel("deleteAccount")}
							>
								Delete account
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

Settings.propTypes = {
	user: PropTypes.object,
	handleCloseSettings: PropTypes.func,
};

export default Settings;
