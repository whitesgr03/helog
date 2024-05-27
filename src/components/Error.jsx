import { useContext } from "react";
import PropTypes from "prop-types";

import style from "../styles/Error.module.css";
import image from "../styles/utils/image.module.css";

import { DarkThemeContext } from "../contexts/DarkThemeContext";

const error = {
	title: "404 Not Found",
	message: "The page you are looking for can't be found.",
};

const Error = () => {
	const [darkTheme] = useContext(DarkThemeContext);
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.error}`}>
			<span className={`${image.icon} ${style.alert}`} />
			<h1 className={style.title}>{error.title}</h1>
			<div className={style.message}>
				<p>Our apologies, there has been an error.</p>
				<p>{error.message}</p>
			</div>
		</div>
	);
};

Error.propTypes = {
	error: PropTypes.object,
};

export default Error;
