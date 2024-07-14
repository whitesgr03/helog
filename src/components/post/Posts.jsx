// Packages
import { format } from "date-fns";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Styles
import style from "../../styles/post/Posts.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import Loading from "../layout/Loading";
import Error from "../layout/Error";

// Utils
import useFetch from "../../hooks/useFetch";

// Variables
import imageUrl from "../../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const url = `${import.meta.env.VITE_RESOURCE_ORIGIN}/blog/posts`;

const Posts = ({ limit = 0 }) => {
	const { data, error, loading } = useFetch(`${url}?limit=${limit}`);

	const postsAddUrl = data ? data.map(post => ({ ...post, imageUrl })) : []; // <- Temporarily add url
	const items = postsAddUrl.map(post => (
		<li key={post._id}>
			<Link to={`/posts/${post._id}`}>
				<div className={image.content}>
					<img src={post.imageUrl} alt={post.title} />
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
				<Error message={error} />
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
