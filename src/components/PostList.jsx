import { useContext } from "react";
import { format } from "date-fns";
import { useOutletContext, Link } from "react-router-dom";
import PropTypes from "prop-types";

import style from "../styles/PostList.module.css";
import image from "../styles/utils/image.module.css";

import { DarkThemeContext } from "../contexts/DarkThemeContext";
import Loading from "./Loading";
import Error from "./Error";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const Post = ({ post, darkTheme }) => (
	<li className={style.item}>
		<Link to={`/posts/${post.id}`}>
			<div className={`${darkTheme ? image.dark : ""} ${image.content}`}>
				<img src={post.url} alt={post.title} />
			</div>
		</Link>
		<div className={style.container}>
			<strong className={style.dateTime}>
				{format(post.createdAt, "MMMM d, y")}
			</strong>
			<Link to={`/posts/${post.id}`}>
				<h3 className={style.title}>{post.title}</h3>
			</Link>
			<p className={style.content}>{post.content}</p>
		</div>
	</li>
);

const PostList = () => {
	const [darkTheme] = useContext(DarkThemeContext);
	const { posts } = useOutletContext();
	const { data, error, loading } = posts;

	const postsAddUrl = data.map(post => ({ ...post, url })); // <- Temporarily add url
	const published = postsAddUrl.filter(post => post.publish);
	const items = published.map(post => <Post key={post._id} post={post} />);

	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.postList}`}>
			{loading ? (
				<Loading />
			) : error ? (
				<Error message={"The posts could not be loaded."} />
			) : (
				<ul>{items}</ul>
			)}
		</div>
	);
};

Post.propTypes = {
	post: PropTypes.object,
	darkTheme: PropTypes.bool,
};

export { PostList as default, Post };
