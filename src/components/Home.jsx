import { useOutletContext, Link } from "react-router-dom";

import style from "../styles/Home.module.css";
import image from "../styles/utils/image.module.css";

import { Post } from "./PostList";
import Loading from "./Loading";
import Error from "./Error";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const Home = () => {
	const { posts } = useOutletContext();
	const { data, error, loading } = posts;

	const postsAddUrl = data ? data.map(post => ({ ...post, url })) : []; // <- Temporarily add url

	const published = postsAddUrl.filter(post => post.publish);
	const latestPosts = published
		.slice(0, 4)
		.map(post => <Post key={post._id} post={post} />);

	return (
		<div className={style.home}>
			<div className={style.container}>
				<div className={style.wrap}>
					<div className={image.content}>
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
						<span
							className={`${image.icon} ${style.doubleArrowRight}`}
						/>
					</Link>
				</div>
			</div>
			<div className={style.latestPosts}>
				<h2>Latest Posts</h2>
				<div>
					{loading ? (
						<Loading />
					) : error ? (
						<Error
							message={"The latest posts could not be loaded."}
						/>
					) : (
						<ul>{latestPosts}</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
