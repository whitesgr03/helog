import style from "../styles/Footer.module.css";
import { container } from "../styles/Contact.module.css";
import { icon } from "../styles/image.module.css";
import { Address } from "../components/Contact";

const Footer = () => {
	return (
		<footer className={style.footer}>
			<div className={container}>
				<a href="#git" alt="github">
					<span className={`${icon} ${style.github}`} />
				</a>
				<div className={style.address}>
					<Address />
				</div>
			</div>
			<p>&copy; 2024 Designed &amp; coded by Weiss Bai</p>
		</footer>
	);
};

export default Footer;
