import { useContext } from "react";
import PropTypes from "prop-types";

import style from "../styles/Error.module.css";
import image from "../styles/utils/image.module.css";

import { DarkThemeContext } from "../contexts/DarkThemeContext";

const Error = ({ message }) => {
	const [darkTheme] = useContext(DarkThemeContext);
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.error}`}>
			<div className={style.message}>
				<p>
					<span className={`${image.icon} ${style.alert}`} />
					Our apologies, there has been an error.
				</p>
				<p>{message}</p>
			</div>
		</div>
	);
};

Error.propTypes = {
	message: PropTypes.string,
};

export default Error;
