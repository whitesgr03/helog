import style from "../styles/PostList.module.css";
import { imageWrap } from "../styles/image.module.css";

import PropTypes from "prop-types";
import { format } from "date-fns";

import { useOutletContext, Link } from "react-router-dom";

const Post = ({ post }) => (
	<Link to={`/posts/${post.id}`}>
		<div className={imageWrap}>
			<img src={post.url} alt={post.title} />
		</div>
		<strong className={style.dateTime}>
			{format(post.createdAt, "MMMM d, y")}
		</strong>
		<h3>{post.title}</h3>

		<p>{post.content}</p>
	</Link>
);

const PostList = () => {
	const { posts } = useOutletContext();

	const list = posts.map(post => (
		<li key={post.id}>
			<Post post={post} />
		</li>
	));

	return <ul className={style.postList}>{list}</ul>;
};

Post.propTypes = {
	post: PropTypes.object,
};

PostList.propTypes = {
	posts: PropTypes.array,
};

export { PostList as default, Post };
