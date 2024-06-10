import PropTypes from "prop-types";

import style from "../styles/Error.module.css";
import image from "../styles/utils/image.module.css";

const defaultMessage =
	"Please come back later or if you have any questions, please contact us.";

const Error = ({ message = null }) => {
	const errorMessage = typeof message === "string" ? message : defaultMessage;

	return (
		<div className={style.error}>
			<span className={`${image.icon} ${style.alert}`} />
			<p>Our apologies, there has been an error.</p>
			<p>{errorMessage}</p>
		</div>
	);
};

Error.propTypes = {
	message: PropTypes.string,
};

export default Error;
