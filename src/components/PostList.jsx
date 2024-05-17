import style from "../styles/PostList.module.css";
import { imageWrap } from "../styles/image.module.css";

import PropTypes from "prop-types";
import { format } from "date-fns";

import { useOutletContext, Link } from "react-router-dom";

const PostList = () => {
	const { posts } = useOutletContext();

	const list = posts.map(post => (
		<li key={post.id}>
			<Link to={`/posts/${post.id}`}>
				<div className={imageWrap}>
					<img src={post.url} alt={post.title} />
				</div>
				<strong className={style.dateTime}>
					{format(post.createdAt, "MMMM d, y")}
				</strong>
				<h2>{post.title}</h2>

				<p>{post.content}</p>
			</Link>
		</li>
	));

	return <ul className={style.postList}>{list}</ul>;
};

PostList.propTypes = {
	posts: PropTypes.array,
};

export default PostList;
