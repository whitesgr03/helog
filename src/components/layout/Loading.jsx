import PropTypes from "prop-types";

// Styles
import style from "../../styles/layout/Loading.module.css";
import image from "../../styles/utils/image.module.css";

export const Loading = ({ text, dark, light, shadow }) => {
	return (
		<div
			className={`${style.loading} ${dark ? style.dark : ""} ${
				light ? style.light : ""
			} ${shadow ? style.shadow : ""}`}
		>
			<span className={`${image.icon} ${style.load}`} />
			{text}
		</div>
	);
};

Loading.propTypes = {
	text: PropTypes.string,
	dark: PropTypes.bool,
	light: PropTypes.bool,
	shadow: PropTypes.bool,
};
