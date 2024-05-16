import style from "../styles/ChangeNameModel.module.css";
import { blur } from "../styles/blur.module.css";

const ChangeNameModel = () => {
	// const darkTheme = useContext(themContext)
	// const user = useContext(userContext)
	return (
		<div className={blur}>
			<form className={style.form}>
				<button type="button" className={`icon ${style.closeBtn}`} />
				<label htmlFor="changeName">Change Name</label>
				<input id="changeName" type="text" name="name" />
				<button className={style.submitBtn} type="submit">
					Save
				</button>
			</form>
		</div>
	);
};

export default ChangeNameModel;
