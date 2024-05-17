import style from "../styles/ChangeNameModel.module.css";
import { settings, closeBtn } from "../styles/Settings.module.css";
import { form } from "../styles/form.module.css";
import { blur } from "../styles/blur.module.css";
import { icon } from "../styles/image.module.css";

const ChangeNameModel = () => {
	// const darkTheme = useContext(themContext)
	// const user = useContext(userContext)
	return (
		<div className={blur}>
			<div className={`${settings} ${style.model}`}>
				<form className={form}>
					<button type="button" className={`${icon} ${closeBtn}`} />
					<label htmlFor="changeName">Change Name</label>
					<input id="changeName" type="text" name="name" />
					<button className={successBtn} type="submit">
						Save
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChangeNameModel;
