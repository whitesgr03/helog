// Packages
import { useState, useEffect } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { Editor } from "@tinymce/tinymce-react";

// Styles
import style from "../../styles/post/PostDetail.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import Loading from "../layout/Loading";
import Error from "../layout/Error";
import Comments from "../comment/Comments";

// Utils
import { getPostDetail } from "../../utils/handlePost";

const PostDetail = () => {
	const { postId } = useParams();
	const { user } = useOutletContext();
	const [post, setPost] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadContent, setLoadContent] = useState(true);

	const createdAt = post?.createdAt && new Date(post.createdAt).getTime();
	const lastModified =
		post?.lastModified && new Date(post.lastModified).getTime();

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetPostDetail = async () => {
			const result = await getPostDetail({ postId, signal });

			const handleResult = () => {
				result.success
					? setPost(result.data)
					: setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};

		handleGetPostDetail();
		return () => controller.abort();
	}, [user, postId]);
	return (
		<>
			{error || post?.content === "" ? (
				<Error message={error} />
			) : (
				<>
					<div
						className={`${
							loading || loadContent ? style.loading : ""
						}`}
					>
						<div id="postDetail" className={style.postDetail}>
							<Link to="/posts" className={style.link}>
								<span
									className={`${style.leftArrow} ${image.icon}`}
								/>
								Back to list
							</Link>

							{post?.title && (
								<h2 className={style.title}>{post.title}</h2>
							)}
							<div className={style.dateTime}>
								<strong>{post?.author?.name}</strong>
								{post?.lastModified && (
									<em>
										{`${
											createdAt === lastModified
												? "Published"
												: "Edited"
										} in ${format(
											createdAt === lastModified
												? post.createdAt
												: post.lastModified,
											"MMMM d, y"
										)}`}
									</em>
								)}

								{post?.mainImageUrl && (
									<div className={style.imageWrap}>
										<div className={image.content}>
											<img
												src={post.mainImageUrl}
												alt={`${post.title} main image`}
											/>
										</div>
									</div>
								)}
							</div>
							<Editor
								apiKey="x2zlv8pvui3hofp395wp6my8308b15h3s176scf930dizek1"
								id="content"
								disabled={true}
								value={post?.content}
								onInit={() => {
									setLoadContent(false);
								}}
								init={{
									menubar: false,
									toolbar: false,
									inline: true,
									plugins: "codesample",
								}}
							/>
						</div>
						<Comments
							postAuthorId={post?.author?._id}
							postId={postId}
						/>
					</div>
					{(loading || loadContent) && <Loading />}
				</>
			)}
		</>
	);
};

PostDetail.propTypes = {
	post: PropTypes.object,
};

export default PostDetail;
