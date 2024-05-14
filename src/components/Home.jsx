import style from "../styles/Home.module.css";

import { Link } from "react-router-dom";

const Home = () => (
	<div className={style.home}>
		<h2 className={style.title}>A Daily Story for Reader.</h2>
		<p>
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio,
			veniam voluptatem veritatis maxime iste rerum quo blanditiis cum ea
			nulla officiis neque molestiae voluptate qui adipisci velit magnam
			consequatur. Quo. Quia voluptas consequuntur assumenda ut totam
			quaerat explicabo eum nemo? Eveniet iste neque eligendi eius
			provident doloremque magnam maiores culpa repudiandae ipsam.
			Repudiandae illum facilis, omnis qui expedita debitis ea.
		</p>
		<Link to={`/`} className={style.link}>
			Latest Posts
			<span className={`icon ${style.doubleArrowRight}`} />
		</Link>
	</div>
);

export default Home;
