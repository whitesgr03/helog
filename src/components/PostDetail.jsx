import style from "../styles/PostDetail.module.css";

import PropTypes from "prop-types";
import { format } from "date-fns";

const PostDetail = ({ post }) => {
	return (
		<ul className={style.postDetail}>
			<li className={style.item}>
				<strong className={style.dateTime}>
					{format(post.createdAt, "MMMM d, y")}
				</strong>
				<h2>{post.title}</h2>
				<img src={post.url} alt={post.title} />
				<strong>
					{`${format(post.createdAt, "MMMM d, y")} edited by author`}
				</strong>
				<p>{post.content}</p>
			</li>
		</ul>
	);
};

PostDetail.propTypes = {
	post: PropTypes.object,
};

export default PostDetail;
