import { useContext } from "react";

import style from "../styles/Loading.module.css";
import image from "../styles/utils/image.module.css";

import { DarkThemeContext } from "../contexts/DarkThemeContext";

const Loading = () => {
	const [darkTheme] = useContext(DarkThemeContext);
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.loading}`}>
			<span className={`${image.icon} ${style.load}`} />
			Loading ...
		</div>
	);
};

export default Loading;
