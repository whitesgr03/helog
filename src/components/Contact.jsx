import { useContext } from "react";

import style from "../styles/Contact.module.css";
import image from "../styles/utils/image.module.css";

import { DarkThemeContext } from "../contexts/DarkThemeContext";

const Address = () => {
	return (
		<address>
			<a href="mailto:whitesgr03@gmail.com">
				<span className={`${image.icon} ${style.email}`} />
				<em>whitesgr03@gmail.com</em>
			</a>
		</address>
	);
};

const Contact = () => {
	const [darkTheme] = useContext(DarkThemeContext);
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.contact}`}>
			<h2>Contact</h2>
			<p>Please contact us, If you have any questions.</p>
			<div className={style.container}>
				<Address />
			</div>
		</div>
	);
};

export { Contact as default, Address };
