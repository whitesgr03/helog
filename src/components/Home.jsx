import style from "../styles/Home.module.css";
import { icon } from "../styles/image.module.css";
import { imageWrap } from "../styles/image.module.css";

import { useOutletContext, Link } from "react-router-dom";

import { Post } from "../components/PostList";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const Home = () => {
	const { posts } = useOutletContext();

	const latestPosts = posts.slice(0, 3).map(post => (
		<li key={post.id}>
			<Post post={post} />
		</li>
	));

	return (
		<div className={style.home}>
			<div className={style.container}>
				<div className={style.wrap}>
					<div className={imageWrap}>
						<img src={url} />
					</div>
				</div>
				<div className={style.content}>
					<h2 className={style.title}>A Daily Story for Reader</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur, adipisicing
						elit. Odio, veniam voluptatem veritatis maxime iste
						rerum quo blanditiis cum ea nulla officiis neque
						molestiae voluptate qui adipisci velit magnam
						consequatur. Quo. Quia voluptas consequuntur assumenda
						ut totam quaerat explicabo eum nemo? Eveniet iste neque
						eligendi eius provident doloremque magnam maiores culpa
						repudiandae ipsam. Repudiandae illum facilis, omnis qui
						expedita debitis ea.
					</p>
					<Link to={`/posts`} className={style.link}>
						<span>Latest </span>
						<span>All </span>Posts
						<span className={`${icon} ${style.doubleArrowRight}`} />
					</Link>
				</div>
			</div>
			<div className={style.latestPosts}>
				<h2>Latest Posts</h2>
				<div className={style.list}>{latestPosts}</div>
			</div>
		</div>
	);
};

export default Home;
