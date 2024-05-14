import style from "../styles/Error.module.css";

import PropTypes from "prop-types";

const Error = ({
	error = {
		title: "404 Not Found",
		message: "The page you are looking for can't be found.",
	},
}) => (
	<div className={style.error}>
		<span className={style.alert}></span>
		<h1 className={style.title}>{error.title}</h1>
		<div className={style.message}>
			<p>Our apologies, there has been an error.</p>
			<p>{error.message}</p>
		</div>
	</div>
);

Error.propTypes = {
	error: PropTypes.object,
};

export default Error;
