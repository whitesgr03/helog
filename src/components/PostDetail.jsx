import style from "../styles/PostDetail.module.css";

import image from "../styles/utils/image.module.css";

import PropTypes from "prop-types";
import { format } from "date-fns";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const post = {
	id: "1",
	url,
	title: "This is title A",
	content: "This is content A",
	createdAt: new Date("2024/5/1"),
	lastModified: new Date("2024/5/1"),
};

const PostDetail = () => {
	const darkTheme = true;
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.postDetail}`}>
			<h2>{post.title}</h2>
			<strong className={style.dateTime}>
				Published in {format(post.createdAt, "MMMM d, y")}
			</strong>
			{post.createdAt.getTime() !== post.lastModified.getTime() && (
				<em>Edited in {format(post.lastModified, "MMMM d, y")}</em>
			)}
			<div className={`${darkTheme ? image.dark : ""} ${image.content}`}>
				<img src={post.url} alt={post.title} />
			</div>
			<p>{post.content}</p>
		</div>
	);
};

PostDetail.propTypes = {
	post: PropTypes.object,
};

export default PostDetail;
