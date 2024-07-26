// Packages
import { useParams } from "react-router-dom";
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
import useFetch from "../../hooks/useFetch";

// Variables
const url = `${import.meta.env.VITE_RESOURCE_ORIGIN}/blog/posts`;

const PostDetail = () => {
	const { postId } = useParams();

	const { data: post, error, loading } = useFetch(`${url}/${postId}`);

	const createdAt = post?.createdAt && new Date(post.createdAt).getTime();
	const lastModified =
		post?.lastModified && new Date(post.lastModified).getTime();

	return (
		<>
			{loading ? (
				<Loading />
			) : error || post?.content === "" ? (
				<Error message={error} />
			) : (
				<div>
					<div id="postDetail" className={style.postDetail}>
						{post?.title && (
							<h2 className={style.title}>{post.title}</h2>
						)}
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
							value={post.content}
							init={{
								menubar: false,
								toolbar: false,
								inline: true,
								plugins: "codesample",
							}}
						/>
					</div>
					<Comments postAuthorId={post.author._id} postId={postId} />
				</div>
			)}
		</>
	);
};

PostDetail.propTypes = {
	post: PropTypes.object,
};

export default PostDetail;
