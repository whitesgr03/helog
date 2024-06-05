import style from "../styles/Contact.module.css";

import Address from "../components/Address";

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

export default Contact;
