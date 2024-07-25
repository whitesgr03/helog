// Packages
import { useState } from "react";
import PropTypes from "prop-types";
import { useOutletContext } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";

// Styles
import style from "../../styles/comment/CommentDetail.module.css";
import image from "../../styles/utils/image.module.css";

// Components
import CommentBox from "./CommentBox";
import Error from "../layout/Error";

// Utils
import { createReply, updateReply, deleteReply } from "../../utils/handleReply";
import { updateComment, deleteComment } from "../../utils/handleComment";

const CommentDetail = ({
	comment,
	replyList,
	postId,
	commentId,
	replyId,
	isPostAuthor,
	isCommentAuthor,
	isDeleted,
	handleGetComments,
	handleGetReplies,
	children,
}) => {
	const {
		user,
		accessToken,
		refreshToken,
		handleVerifyTokenExpire,
		handleExChangeToken,
	} = useOutletContext();
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyCommentBox, setShowReplyCommentBox] = useState(false);
	const [showEditBox, setShowEditBox] = useState(false);
	const [error, setError] = useState(null);

	const handleShowReplies = () => setShowReplies(!showReplies);
	const handleShowEditBox = () => {
		setShowEditBox(!showEditBox);
	};
	const handleShowReplyCommentBox = () =>
		setShowReplyCommentBox(!showReplyCommentBox);

	const handleCreateReply = async fields => {
		const isTokenExpire = await handleVerifyTokenExpire(accessToken);
		isTokenExpire && (await handleExChangeToken(refreshToken));

		const data = {
			...fields,
			post: postId,
			comment: commentId,
		};

		replyId && (data.reply = replyId);

		const result = await createReply({
			token: accessToken,
			data,
		});

		return result;
	};

	const handleDelete = async () => {
		const isTokenExpire = await handleVerifyTokenExpire(accessToken);
		isTokenExpire && handleExChangeToken(refreshToken);

		const obj = {
			token: accessToken,
		};

		replyId ? (obj.replyId = replyId) : (obj.commentId = commentId);

		const result = replyId
			? await deleteReply(obj)
			: await deleteComment(obj);

		result.success
			? replyId
				? await handleGetReplies()
				: await handleGetComments()
			: setError(result.message);
	};

	const handleUpdate = async fields => {
		const isTokenExpire = await handleVerifyTokenExpire(accessToken);
		isTokenExpire && handleExChangeToken(refreshToken);

		const obj = {
			token: accessToken,
			data: {
				...fields,
			},
		};

		replyId ? (obj.replyId = replyId) : (obj.commentId = commentId);

		const result = replyId
			? await updateReply(obj)
			: await updateComment(obj);

		return result;
	};

	return (
		<>
			{error ? (
				<Error message={error} />
			) : (
				<li id={`item-${comment._id}`}>
					<div
						className={`${style.container} ${
							isPostAuthor ? style.author : ""
						} ${isCommentAuthor ? style.user : ""}`}
						data-testid="container"
					>
						{!isDeleted && (
							<div className={style.buttonWrap}>
								{isPostAuthor && (
									<em
										className={`${
											isPostAuthor ? style.highlight : ""
										}`}
									>
										POST AUTHOR
									</em>
								)}
								{(isCommentAuthor || user.isAdmin) && (
									<div className={style.commentButton}>
										<button onClick={handleDelete}>
											<span
												className={`${image.icon} ${style.delete}`}
											/>
										</button>

										<button onClick={handleShowEditBox}>
											<span
												className={`${image.icon} ${style.edit}`}
											/>
										</button>
									</div>
								)}
							</div>
						)}
						<div className={style.infoWrap}>
							<div className={style.info}>
								<div className={style.avatar}>
									{!isDeleted && (
										<>
											{comment.author.name
												.charAt(0)
												.toUpperCase()}
										</>
									)}
								</div>
								<strong
									title={
										!isDeleted ? comment?.author.name : ""
									}
								>
									{!isDeleted
										? comment?.author.name
										: "[deleted]"}
								</strong>
							</div>
							<div className={style.time}>
								{`${formatDistanceToNowStrict(
									comment.lastModified
								)} ago ${
									comment.createdAt !==
										comment.lastModified && "(edited)"
								}`}
							</div>
						</div>

						{!isDeleted && showEditBox ? (
							<div className={style.editBoxWrap}>
								<CommentBox
									submitBtn={"Update"}
									onGetComments={
										replyId
											? handleGetReplies
											: handleGetComments
									}
									onCreateComment={handleUpdate}
									onCloseCommentBox={handleShowEditBox}
									defaultValue={comment.content}
								/>
							</div>
						) : (
							<div className={style.content}>
								{!isDeleted && comment.reply && (
									<a href={`#item-${comment.reply._id}`}>
										@
										{comment.reply.deleted
											? "[delete]"
											: comment.reply.author.name}
									</a>
								)}
								<p>{comment.content}</p>
							</div>
						)}

						{(replyList || (!isDeleted && !showEditBox)) && (
							<div className={style.buttonWrap}>
								{replyList && (
									<button
										className={style.replyListBtn}
										onClick={handleShowReplies}
									>
										<span
											className={`${image.icon} ${
												style.replyIcon
											} ${
												showReplies ? style.active : ""
											}`}
											data-testid="commentIcon"
										/>
										{replyList.length}
									</button>
								)}
								{!isDeleted && !showEditBox && (
									<button
										className={style.addReplyBtn}
										onClick={handleShowReplyCommentBox}
									>
										Reply
									</button>
								)}
							</div>
						)}
					</div>

					{!isDeleted && showReplyCommentBox && (
						<div className={style.commentBoxWrap}>
							<CommentBox
								submitBtn={"Reply"}
								onGetComments={handleGetReplies}
								onCreateComment={handleCreateReply}
								onCloseCommentBox={handleShowReplyCommentBox}
							/>
						</div>
					)}
					{showReplies && (
						<ul className={style.replies}>{children}</ul>
					)}
				</li>
			)}
		</>
	);
};

CommentDetail.propTypes = {
	postId: PropTypes.string,
	commentId: PropTypes.string,
	replyId: PropTypes.string,
	comment: PropTypes.object,
	replyList: PropTypes.array,
	isPostAuthor: PropTypes.bool,
	isCommentAuthor: PropTypes.bool,
	isDeleted: PropTypes.bool,
	handleGetComments: PropTypes.func,
	handleGetReplies: PropTypes.func,
	children: PropTypes.node,
};

export default CommentDetail;
