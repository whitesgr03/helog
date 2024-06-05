import { format } from "date-fns";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import style from "../styles/Posts.module.css";
import image from "../styles/utils/image.module.css";

import Loading from "./Loading";
import Error from "./Error";

import useFetch from "../hooks/useFetch";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const GET_POSTS_URL = "http://localhost:3000/blog/posts";

const Posts = ({ limit = 0 }) => {
	const { data, error, loading } = useFetch(
		`${GET_POSTS_URL}?limit=${limit}`
	);

	const postsAddUrl = data ? data.map(post => ({ ...post, url })) : []; // <- Temporarily add url
	const items = postsAddUrl.map(post => (
		<li key={post._id}>
			<Link to={`/posts/${post._id}`}>
				<div className={image.content}>
					<img src={post.url} alt={post.title} />
				</div>
			</Link>
			<div className={style.container}>
				<strong className={style.dateTime}>
					{format(post.createdAt, "MMMM d, y")}
				</strong>
				<Link to={`/posts/${post._id}`}>
					<h3 className={style.title}>{post.title}</h3>
				</Link>
				<p className={style.content}>{post.content}</p>
			</div>
		</li>
	));

	return (
		<>
			{loading ? (
				<Loading />
			) : error ? (
				<Error message={"The posts could not be loaded."} />
			) : (
				<>
					{items.length > 0 ? (
						<ul className={style.posts}>{items}</ul>
					) : (
						<p>There are not posts.</p>
					)}
				</>
			)}
		</>
	);
};

Posts.propTypes = {
	limit: PropTypes.number,
};

export default Posts;
