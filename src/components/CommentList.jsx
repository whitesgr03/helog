import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";

import style from "../styles/CommentList.module.css";
import image from "../styles/utils/image.module.css";

import handleFetch from "../utils/handleFetch";

import Loading from "./Loading";
import Error from "./Error";

const getPostsUrl = "http://localhost:3000/blog/posts";

const Comment = ({ comment, postAuthor, children }) => {
	const { user } = useOutletContext();
	return (
		<div
			className={`${
				postAuthor === comment.author.name ? style.author : ""
			} ${user?.author.name === comment.author.name ? style.user : ""} ${
				style.container
			}`}
		>
			<div className={style.info}>
				{postAuthor === comment.author.name && (
					<strong>POST AUTHOR</strong>
				)}
				<h3>
					{comment.author.name === user?.author.name
						? "Me"
						: comment.author.name}
				</h3>
				<span>{format(comment.createdAt, "MMMM d, y")}</span>
			</div>
			<p className={style.content}>{comment.content}</p>
			{children}
		</div>
	);
};

const CommentList = ({ postAuthor, postId }) => {
	const [commentIds, setCommentIds] = useState({});
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const parentComments = comments.filter(comment => !comment.reply);
	const replyComments = comments.filter(comment => comment.reply);

	const items = parentComments.map(comment => {
		const replyList = [...replyComments].filter(
			rComment =>
				rComment.reply === comment._id &&
				replyComments.splice(
					replyComments.findIndex(
						reply => reply._id === rComment._id
					),
					1
				)
		);
		return (
			<li key={comment._id}>
				<Comment postAuthor={postAuthor} comment={comment}>
					<div className={style.buttonWrap}>
						{replyList.length > 0 && (
							<button
								className={style.commentBtn}
								data-id={comment._id}
							>
								<span
									className={`${image.icon} ${
										style.comment
									} ${
										commentIds[comment._id]
											? style.active
											: ""
									}`}
								></span>
								{replyList.length}
							</button>
						)}
						<button className={style.replyBtn}>Reply</button>
					</div>
				</Comment>
				{replyList.length > 0 && (
					<ul
						className={`${style.reply} ${
							commentIds[comment._id] ? style.active : ""
						}`}
					>
						{replyList.map(reply => (
							<li key={reply._id}>
								<Comment
									comment={reply}
									postAuthor={postAuthor}
								/>
							</li>
						))}
					</ul>
				)}
			</li>
		);
	});

	const handleShowComment = e => {
		const { id } = e.target.dataset;
		const { [id]: existsId, ...rest } = commentIds;
		id && setCommentIds(existsId ? { ...rest } : { ...rest, [id]: id });
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;
		const handleGetComments = async () => {
			try {
				const data = await handleFetch(
					`${getPostsUrl}/${postId}/comments`
				);
				setComments(data);
				setLoading(false);
			} catch (err) {
				!signal.aborted && setError(err.cause);
				!signal.aborted && setLoading(false);
			}
		};
		handleGetComments();
		return () => controller.abort();
	}, [postId]);

	return (
		<div className={style.commentList}>
			<h3>Comments</h3>
			{loading ? (
				<Loading />
			) : error ? (
				<Error message={"The comments could not be loaded."} />
			) : (
				<>
					{items.length > 0 ? (
						<ul onClick={handleShowComment}>{items}</ul>
					) : (
						<p>There are not comments.</p>
					)}
				</>
			)}
		</div>
	);
};

CommentList.propTypes = {
	postAuthor: PropTypes.string,
	postId: PropTypes.string,
};

Comment.propTypes = {
	comment: PropTypes.object,
	postAuthor: PropTypes.string,
	user: PropTypes.object,
	children: PropTypes.node,
};

export default CommentList;
