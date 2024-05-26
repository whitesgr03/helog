import style from "../styles/Error.module.css";
import image from "../styles/utils/image.module.css";

const NotFound = () => {
	const darkTheme = false;
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.error}`}>
			<span className={`${image.icon} ${style.alert}`} />
			<h1 className={style.title}>404 Not Found</h1>
			<div className={style.message}>
				<p>Our apologies, there has been an error.</p>
				<p>The page you are looking for cannot be found.</p>
			</div>
		</div>
	);
};

export default NotFound;
