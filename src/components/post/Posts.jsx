// Packages
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Link, useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";

// Styles
import style from "../../styles/post/Posts.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import Loading from "../layout/Loading";
import Error from "../layout/Error";

// Utils
import { getPosts } from "../../utils/handlePost";

const Posts = ({ limit = 0 }) => {
	const { user } = useOutletContext();
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const items = posts.map(
		post =>
			post?.content !== "" && (
				<li key={post._id}>
					<div className={style.info}>
						<strong
							className={style.dateTime}
							title={post.author.name}
						>
							{post.author.name}
						</strong>
						<em>
							{format(
								new Date(post.createdAt).getTime() ===
									new Date(post.lastModified).getTime()
									? post.createdAt
									: post.lastModified,
								"MMMM d, y"
							)}
						</em>
					</div>

					<Link to={`/posts/${post._id}`}>
						<div className={image.content}>
							{post.mainImageUrl ? (
								<img
									src={post.mainImageUrl}
									alt={`${post.title} main image`}
								/>
							) : (
								<div className={style.emptyImageWrap}>
									{"( Empty Main Image )"}
								</div>
							)}
						</div>
					</Link>

					<Link to={`/posts/${post._id}`}>
						<h3 className={style.title} title={post.title}>
							{post.title ?? "( Empty Title )"}
						</h3>
					</Link>
				</li>
			)
	);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPosts = async () => {
			const result = await getPosts({ limit, signal });

			const handleResult = () => {
				result.success
					? setPosts(result.data)
					: setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};

		handleGetPosts();
		return () => controller.abort();
	}, [user, limit]);

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
