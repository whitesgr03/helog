import PropTypes from "prop-types";

import style from "../styles/Error.module.css";
import image from "../styles/utils/image.module.css";

const Error = ({ message }) => {
	return (
		<div className={style.error}>
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
