import style from "../styles/PostList.module.css";

import image from "../styles/utils/image.module.css";

import PropTypes from "prop-types";
import { format } from "date-fns";

import { useOutletContext, Link } from "react-router-dom";

const Post = ({ post, darkTheme }) => (
	<>
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
	</>
);

const PostList = () => {
	const darkTheme = true;
	const { posts } = useOutletContext();

	const items = posts.map(post => (
		<li key={post.id} className={style.item}>
			<Post post={post} />
		</li>
	));

	return (
		<ul className={`${darkTheme ? style.dark : ""}  ${style.postList}`}>
			{items}
		</ul>
	);
};

Post.propTypes = {
	post: PropTypes.object,
	darkTheme: PropTypes.bool,
};

PostList.propTypes = {
	posts: PropTypes.array,
};

export { PostList as default, Post };
