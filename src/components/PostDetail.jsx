import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { format } from "date-fns";

import style from "../styles/PostDetail.module.css";
import image from "../styles/utils/image.module.css";

import Loading from "./Loading";
import Error from "./Error";
import CommentList from "./CommentList";

import useFetch from "../hooks/useFetch";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const getPostsUrl = "http://localhost:3000/blog/posts";

const PostDetail = () => {
	const { postId } = useParams();

	const { data: post, error, loading } = useFetch(`${getPostsUrl}/${postId}`);

	return (
		<>
			{loading ? (
				<Loading />
			) : error ? (
				<Error message={"The post could not be loaded."} />
			) : (
				<div>
					<div className={style.postDetail}>
						<h2 className={style.title}>{post.title}</h2>
						<div
							className={`${style.dateTime} 
							${
								new Date(post.createdAt).getTime() !==
								new Date(post.lastModified).getTime()
									? style.lastModified
									: style.createdAt
							}
							`}
						>
							<strong>
								Published in{" "}
								{format(post.createdAt, "MMMM d, y")}
							</strong>
							{new Date(post.createdAt).getTime() !==
								new Date(post.lastModified).getTime() && (
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
					<CommentList
						postAuthor={post.author.name}
						postId={postId}
					/>
				</div>
			)}
		</>
	);
};

PostDetail.propTypes = {
	post: PropTypes.object,
};

export default PostDetail;
