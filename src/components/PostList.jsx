import style from "../styles/PostList.module.css";

import PropTypes from "prop-types";
import { format } from "date-fns";


const PostList = ({ posts }) => {
	const list = posts.map(post => (
		<li key={post.id} className={style.item}>
			<img src={post.url} alt={post.title} />
			<strong className={style.dateTime}>
				{format(post.createdAt, "MMMM d, y")}
			</strong>
			<h2>{post.title}</h2>
			<p>{post.content}</p>
		</li>
	));

	return <ul className={style.postList}>{list}</ul>;
};

PostList.propTypes = {
	posts: PropTypes.array,
};

export default PostList;
