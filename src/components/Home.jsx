// Packages
import { Link } from "react-router-dom";

// Styles
import style from "../styles/Home.module.css";
import image from "../styles/utils/image.module.css";

// Components
import Posts from "./post/Posts";

// Variables
import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const Home = () => {
	return (
		<div className={style.home}>
			<div className={style.container}>
				<div className={style.wrap}>
					<div className={image.content}>
						<img src={url} />
					</div>
				</div>
				<div className={style.content}>
					<h2 className={style.title}>A Daily Stories For Reader</h2>
					<p>
						The personal blog is an ongoing online diary or
						commentary written by an individual, rather than a
						corporation or organization. While the vast majority of
						personal blogs attract very few readers, other than the
						blogger&apos;s immediate family and friends, a small
						number of personal blogs have become popular, to the
						point that they have attracted lucrative advertising
						sponsorship. A tiny number of personal bloggers have
						become famous, both in the online community and in the
						real world.
					</p>
					<Link to={`/posts`} className={style.link}>
						<span>Latest </span>
						<span>All </span>Posts
						<span
							className={`${image.icon} ${style.doubleArrowRight}`}
						/>
					</Link>
				</div>
			</div>
			<div className={style.latestPosts}>
				<h2>Latest Posts</h2>
				<Posts limit={4} />
			</div>
		</div>
	);
};

export default Home;
