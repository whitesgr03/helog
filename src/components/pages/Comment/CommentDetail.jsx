// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// Styles
import styles from './CommentDetail.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { CommentBox } from './CommentBox';
import { DeleteModel } from '../../layout/Header/DeleteModel';

// Utils
import {
	createReply,
	updateReply,
	deleteReply,
} from '../../../utils/handleReply';
import { updateComment, deleteComment } from '../../../utils/handleComment';

export const CommentDetail = ({
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
		onModel,
		accessToken,
		handleVerifyTokenExpire,
		handleExChangeToken,
		onAlert,
	} = useOutletContext();
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyCommentBox, setShowReplyCommentBox] = useState(false);
	const [showEditBox, setShowEditBox] = useState(false);

	const handleShowReplies = () => setShowReplies(!showReplies);
	const handleShowEditBox = () => {
		setShowEditBox(!showEditBox);
	};
	const handleShowReplyCommentBox = () =>
		setShowReplyCommentBox(!showReplyCommentBox);

	const handleCreateReply = async fields => {
		const isTokenExpire = await handleVerifyTokenExpire();
		const newAccessToken = isTokenExpire && (await handleExChangeToken());

		const data = {
			...fields,
			post: postId,
			comment: commentId,
		};

		replyId && (data.reply = replyId);

		const result = await createReply({
			token: newAccessToken || accessToken,
			data,
		});

		return result;
	};

	const handleUpdate = async fields => {
		const isTokenExpire = await handleVerifyTokenExpire();
		const newAccessToken = isTokenExpire && (await handleExChangeToken());

		const obj = {
			token: newAccessToken || accessToken,
			data: {
				...fields,
			},
		};

		replyId ? (obj.replyId = replyId) : (obj.commentId = commentId);

		const result = replyId ? await updateReply(obj) : await updateComment(obj);

		return result;
	};

	return (
		<li id={`item-${comment._id}`}>
			<div
				className={`${styles.container} ${
					isPostAuthor ? styles.author : ''
				} ${isCommentAuthor ? styles.user : ''}`}
				data-testid="container"
			>
				{!comment.deleted && (
					<div className={styles.buttonWrap}>
						{isPostAuthor && (
							<em className={`${isPostAuthor ? styles.highlight : ''}`}>
								POST AUTHOR
							</em>
						)}
						{(isCommentAuthor || user?.isAdmin) && (
							<div className={styles.commentButton}>
								<button onClick={handleActiveModel}>
									<span className={`${imageStyles.icon} ${styles.delete}`} />
								</button>

								<button onClick={handleShowEditBox}>
									<span className={`${imageStyles.icon} ${styles.edit}`} />
								</button>
							</div>
						)}
					</div>
				)}
				<div className={styles.infoWrap}>
					<div className={styles.info}>
						<div className={styles.avatar}>
							{!comment.deleted && (
								<>{comment.author.username.charAt(0).toUpperCase()}</>
							)}
						</div>
						<strong title={!comment.deleted ? comment.author.username : ''}>
							{!comment.deleted ? comment.author.username : '[deleted]'}
						</strong>
					</div>
					<div className={styles.time}>
						{`${formatDistanceToNow(comment.lastModified)} ago `}
						{comment.createdAt !== comment.lastModified && '(edited)'}
					</div>
				</div>

				{!comment.deleted && showEditBox ? (
					<div className={styles.editBoxWrap}>
						<CommentBox
							submitBtn={'Update'}
							onGetComments={replyId ? handleGetReplies : handleGetComments}
							onCreateComment={handleUpdate}
							onCloseCommentBox={handleShowEditBox}
							defaultValue={comment.content}
						/>
					</div>
				) : (
					<div className={styles.content}>
						{!comment.deleted && comment.reply && (
							<a href={`#item-${comment.reply._id}`}>
								@
								{comment.reply.deleted
									? '[delete]'
									: comment.reply.author.username}
							</a>
						)}
						<p>{comment.content}</p>
					</div>
				)}

				{(replyList || (!isDeleted && !showEditBox)) && (
					<div className={styles.buttonWrap}>
						{replyList && (
							<button
								className={styles.replyListBtn}
								onClick={handleShowReplies}
							>
								<span
									className={`${imageStyles.icon} ${
										styles.replyIcon
									} ${showReplies ? styles.active : ''}`}
									data-testid="commentIcon"
								/>
								{replyList.length}
							</button>
						)}
						{user && !isDeleted && !showEditBox && (
							<button
								className={styles.addReplyBtn}
								onClick={handleShowReplyCommentBox}
							>
								Reply
							</button>
						)}
					</div>
				)}
			</div>

			{!isDeleted && showReplyCommentBox && (
				<div className={styles.commentBoxWrap}>
					<CommentBox
						submitBtn={'Reply'}
						onGetComments={handleGetReplies}
						onCreateComment={handleCreateReply}
						onCloseCommentBox={handleShowReplyCommentBox}
					/>
				</div>
			)}
			{showReplies && <ul className={styles.replies}>{children}</ul>}
		</li>
	);
};

CommentDetail.propTypes = {
	postId: PropTypes.string,
	replyId: PropTypes.string,
	comment: PropTypes.object,
	replyList: PropTypes.array,
	isPostAuthor: PropTypes.bool,
	isCommentAuthor: PropTypes.bool,
	handleGetComments: PropTypes.func,
	handleGetReplies: PropTypes.func,
	children: PropTypes.node,
};
