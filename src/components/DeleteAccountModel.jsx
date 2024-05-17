import style from "../styles/DeleteAccountModel.module.css";
import { blur } from "../styles/blur.module.css";
import { button, errorBtn } from "../styles/button.module.css";
import { settings, closeBtn } from "../styles/Settings.module.css";

const DeleteAccountModel = () => {
	// const darkTheme = useContext(themContext)
	// const user = useContext(userContext)
	return (
		<div className={blur}>
			<div className={`${settings} ${style.model}`}>
				<button type="button" className={`icon ${closeBtn}`} />
				<span>Delete Account</span>
				<span className={style.content}>
					Do you really want to delete?
				</span>
				<div className={style.buttonWrap}>
					<button className={`${button} ${style.cancelBtn}`}>
						Cancel
					</button>
					<button className={errorBtn}>Delete</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteAccountModel;
