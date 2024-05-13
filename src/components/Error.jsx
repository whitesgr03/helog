import style from "../styles/Error.module.css";

import PropTypes from "prop-types";

const Alert = ({ width, height }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8m-1 11v2h2v-2zm0-2h2V6h-2z"
		></path>
	</svg>
);

const Error = ({ error }) => (
	<div className={style.error}>
		<Alert width={80} height={80} />
		<h1 className={style.title}>{error.title}</h1>
		<div className={style.message}>
			<p>Our apologies, there has been an error.</p>
			<p>{error.message}</p>
		</div>
	</div>
);

Alert.propTypes = {
	height: PropTypes.number,
	width: PropTypes.number,
};

Error.propTypes = {
	error: PropTypes.object,
};

export default Error;
