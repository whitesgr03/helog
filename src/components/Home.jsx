import { Link } from "react-router-dom";

import style from "../styles/Home.module.css";

import PropTypes from "prop-types";

const DoubleArrowRight = ({ width, height }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		viewBox="0 0 24 24"
	>
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="m5.36 19l5.763-5.763a1.738 1.738 0 0 0 0-2.474L5.36 5m7 14l5.763-5.763a1.738 1.738 0 0 0 0-2.474L12.36 5"
		></path>
	</svg>
);

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
			<DoubleArrowRight height={20} width={20} />
		</Link>
	</div>
);

DoubleArrowRight.propTypes = {
	height: PropTypes.number,
	width: PropTypes.number,
};

export default Home;
