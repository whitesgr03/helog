import style from "../styles/Footer.module.css";

const Footer = () => {
	return (
		<footer className={style.footer}>
			<address className={style.contact}>
				<a href="#git" alt="github">
					<span className={`icon ${style.github}`} />
				</a>
				<a className={style.link} href="mailto@whitesgr03@gmail.com">
					<span className={`icon ${style.email}`} />
					<em>whitesgr03@gmail.com</em>
				</a>
			</address>
			<p>&copy; 2024 Designed &amp; coded by Weiss Bai</p>
		</footer>
	);
};

export default Footer;
