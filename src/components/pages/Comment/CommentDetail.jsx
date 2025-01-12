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
import { CommentDelete } from './CommentDelete';

// Utils
import { updateComment } from '../../../utils/handleComment';

export const CommentDetail = ({ post, comment, onUpdatePost, children }) => {
	const { user, onAlert, onActiveModal } = useOutletContext();
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyCommentBox, setShowReplyCommentBox] = useState(false);
	const [showEditBox, setShowEditBox] = useState(false);

	const isCommentOwner = user?.username === comment?.author?.username;
	const isPostAuthor = post.author.username === comment?.author?.username;

	const handleShowReplies = () => setShowReplies(!showReplies);
	const handleShowEditBox = () => {
		setShowEditBox(!showEditBox);
	};
	const handleShowReplyCommentBox = () =>
		setShowReplyCommentBox(!showReplyCommentBox);

	return (
		<li id={`item-${comment._id}`}>
			<div
				className={`${styles.container} ${
					isPostAuthor ? styles.author : ''
				} ${isCommentOwner ? styles.user : ''}`}
				data-testid="container"
			>
				{!comment.deleted && (
					<div className={styles['button-wrap']}>
						{isPostAuthor && (
							<em className={`${isPostAuthor ? styles.highlight : ''}`}>
								POST AUTHOR
							</em>
						)}
						{(isCommentOwner || user?.isAdmin) && (
							<div className={styles['comment-button']}>
								<button
									onClick={() =>
										onActiveModal({
											component: (
												<CommentDelete
													post={post}
													commentId={comment._id}
													onActiveModal={onActiveModal}
													onAlert={onAlert}
													onUpdatePost={onUpdatePost}
												/>
											),
										})
									}
								>
									<span className={`${imageStyles.icon} ${styles.delete}`} />
								</button>

								<button onClick={handleShowEditBox}>
									<span className={`${imageStyles.icon} ${styles.edit}`} />
								</button>
							</div>
						)}
					</div>
				)}
				<div className={styles['info-wrap']}>
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
						{`${formatDistanceToNow(comment.updatedAt)} ago `}
						{new Date(comment.createdAt).getTime() !==
						new Date(comment.updatedAt).getTime()
							? '(edited)'
							: ''}
					</div>
				</div>

				{!comment.deleted && showEditBox ? (
					<div className={styles['edit-box-wrap']}>
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
	post: PropTypes.object,
	comment: PropTypes.object,
	onUpdatePost: PropTypes.func,
	children: PropTypes.node,
};
