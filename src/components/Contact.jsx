import style from "../styles/Contact.module.css";
import image from "../styles/utils/image.module.css";

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
	return (
		<div className={style.contact}>
			<h3>Contact</h3>
			<p>Please contact us, If you have any questions.</p>
			<div className={style.container}>
				<Address />
			</div>
		</div>
	);
};

export { Contact as default, Address };
