import style from "../styles/Contact.module.css";
import { icon } from "../styles/image.module.css";

const Address = () => {
	return (
		<address>
			<a href="mailto@whitesgr03@gmail.com">
				<span className={`${icon} ${style.email}`} />
				<em>whitesgr03@gmail.com</em>
			</a>
		</address>
	);
};

const Contact = () => {
	return (
		<div className={style.contact}>
			<h2>Contact</h2>
			<p>Please contact us, If you have any questions.</p>
			<div className={style.container}>
				<Address />
			</div>
		</div>
	);
};

export { Contact as default, Address };
