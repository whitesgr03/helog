import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { format } from "date-fns";

import style from "../styles/PostDetail.module.css";
import image from "../styles/utils/image.module.css";

import Loading from "./Loading";
import Error from "./Error";
import Comments from "./Comments";

import useFetch from "../hooks/useFetch";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const getPostsUrl = `${import.meta.env.VITE_HOST}/blog/posts`;

const PostDetail = () => {
	const { postId } = useParams();

	const { data: post, error, loading } = useFetch(`${getPostsUrl}/${postId}`);

	const createdAt = post?.createdAt && new Date(post.createdAt).getTime();
	const lastModified =
		post?.lastModified && new Date(post.lastModified).getTime();

	return (
		<>
			{loading ? (
				<Loading />
			) : error ? (
				<Error message={error} />
			) : (
				<div>
					<div className={style.postDetail}>
						<h2 className={style.title}>{post.title}</h2>
						<div
							className={`${style.dateTime}
							${
								lastModified && createdAt !== lastModified
									? style.lastModified
									: style.createdAt
							}
							`}
						>
							<strong>
								Published in{" "}
								{format(post.createdAt, "MMMM d, y")}
							</strong>
							{lastModified && createdAt !== lastModified && (
								<em>
									Edited in{" "}
									{format(post.lastModified, "MMMM d, y")}
								</em>
							)}

							<div className={image.content}>
								<img src={url} alt={post.title} />
							</div>
						</div>
						<p>{post.content}</p>
					</div>
					<Comments postAuthor={post?.author.name} postId={postId} />
				</div>
			)}
		</>
	);
};

PostDetail.propTypes = {
	post: PropTypes.object,
};

export default PostDetail;
