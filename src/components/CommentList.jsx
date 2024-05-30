import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";

import style from "../styles/CommentList.module.css";
import image from "../styles/utils/image.module.css";

import useFetch from "../hooks/useFetch";

import Loading from "./Loading";
import Error from "./Error";

const getPostsUrl = "http://localhost:3000/blog/posts";

const Comment = ({ comment, postAuthor, user, children }) => (
	<div
		className={`${postAuthor === comment.author ? style.author : ""} ${
			user.author === comment.author ? style.user : ""
		} ${style.container}`}
	>
		<div className={style.info}>
			{postAuthor === comment.author && <strong>POST AUTHOR</strong>}
			<h3>{comment.author === user.author ? "Me" : comment.author}</h3>
			<span>{format(comment.createdAt, "MMMM d, y")}</span>
		</div>
		<p className={style.content}>{comment.content}</p>
		{children}
	</div>
);

const CommentList = ({ postAuthor, postId }) => {
	const [commentIds, setCommentIds] = useState({});
	const { user } = useOutletContext();

	const { data, error, loading } = useFetch(
		`${getPostsUrl}/${postId}/comments`
	);

	const comments = data ?? [];

	const parentComments = comments.filter(comment => !comment?.reply);
	const replyComments = comments.filter(comment => comment.reply);

	const items = parentComments.map(comment => {
		const replyList = [...replyComments].filter(
			rComment =>
				rComment.reply === comment.id &&
				replyComments.splice(
					replyComments.findIndex(reply => reply.id === rComment.id),
					1
				)
		);

		return (
			<li key={comment.id}>
				<Comment postAuthor={postAuthor} user={user} comment={comment}>
					<div className={style.buttonWrap}>
						{replyList.length > 0 && (
							<button
								className={style.commentBtn}
								data-id={comment.id}
							>
								<span
									className={`${image.icon} ${
										style.comment
									} ${
										commentIds[comment.id]
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
							commentIds[comment.id] ? style.active : ""
						}`}
					>
						{replyList.map(reply => (
							<li key={reply.id}>
								<Comment
									comment={reply}
									postAuthor={postAuthor}
									user={user}
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
