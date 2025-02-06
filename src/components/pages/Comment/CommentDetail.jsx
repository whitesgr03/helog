// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// Styles
import styles from './CommentDetail.module.css';
import imageStyles from '../../../styles/image.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Replies } from '../Reply/Replies';
import { CommentUpdate } from './CommentUpdate';
import { CommentDelete } from './CommentDelete';
import { ReplyCreate } from '../Reply/ReplyCreate';

// Utils
import { getReplies } from '../../../utils/handleReply';

export const CommentDetail = ({ index, post, comment }) => {
	const { user, onAlert, onActiveModal, onUpdatePost } = useOutletContext();
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyBox, setShowReplyBox] = useState(false);
	const [showEditBox, setShowEditBox] = useState(false);
	const [loading, setLoading] = useState(false);

	const isCommentOwner = user?.username === comment?.author?.username;
	const isPostAuthor = post.author.username === comment?.author?.username;

	const handleDelete = () => {
		setShowEditBox(false);
		onActiveModal({
			component: (
				<CommentDelete
					post={post}
					commentId={comment._id}
					onUpdatePost={onUpdatePost}
					onAlert={onAlert}
					onActiveModal={onActiveModal}
				/>
			),
		});
	};

	const handleGetReplies = async () => {
		setLoading(true);

		const result = await getReplies({
			commentId: comment._id,
			skip: 0,
		});

		const handleSuccess = () => {
			const newComments = post.comments.map(postComment =>
				postComment._id === comment._id
					? { ...postComment, replies: result.data }
					: postComment,
			);
			onUpdatePost({ postId: post._id, newComments });
		};

		result.success
			? handleSuccess()
			: onAlert({
					message: 'There are some errors occur, please try again later.',
					error: true,
					delay: 3000,
				});

		setLoading(false);
	};

	const handleShowReplies = async () => {
		comment?.replies === undefined && (await handleGetReplies());
		setShowReplies(!showReplies);
	};
	const handleShowEditBox = () => {
		setShowEditBox(!showEditBox);
	};
	const handleShowReplyBox = async () => {
		comment?.countReplies > 0 &&
			comment?.replies === undefined &&
			(await handleGetReplies());

		setShowReplyBox(!showReplyBox);
	};

	return (
		<li id={`item-${comment._id}`}>
			<div
				className={`${styles.container} ${
					!comment.deleted && isPostAuthor ? styles.author : ''
				} ${!comment.deleted && isCommentOwner ? styles.user : ''}`}
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
								<button onClick={handleDelete}>
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
						<span>{`[${index + 1}]`}</span>
						<div className={styles.avatar}>
							{!comment.deleted && (
								<span>{comment.author.username.charAt(0).toUpperCase()}</span>
							)}
						</div>
						<strong title={!comment.deleted ? comment?.author?.username : ''}>
							{!comment.deleted ? comment?.author?.username : '[deleted]'}
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
				{showEditBox ? (
					<div className={styles['edit-box-wrap']}>
						<CommentUpdate
							post={post}
							comment={comment}
							onCloseCommentBox={handleShowEditBox}
						/>
					</div>
				) : (
					<div className={styles.content}>
						<p>{comment.content}</p>
					</div>
				)}

				<div className={styles['button-wrap']}>
					{comment.countReplies > 0 && (
						<button
							className={styles['reply-list-btn']}
							onClick={handleShowReplies}
						>
							<span
								className={`${imageStyles.icon} ${
									styles['reply-icon']
								} ${showReplies && comment?.replies ? styles.active : ''}`}
								data-testid="commentIcon"
							/>
							{loading ? (
								<span
									className={`${imageStyles.icon} ${buttonStyles['load']}`}
								/>
							) : (
								comment.countReplies
							)}
						</button>
					)}
					{user && !comment.deleted && (
						<button
							className={styles['add-reply-btn']}
							onClick={handleShowReplyBox}
						>
							Reply
						</button>
					)}
				</div>
			</div>

			{showReplyBox && comment?.replies && (
				<div className={styles['comment-box-wrap']}>
					<ReplyCreate
						post={post}
						comment={comment}
						onCloseReplyBox={handleShowReplyBox}
					/>
				</div>
			)}

			{showReplies && comment?.replies && (
				<Replies post={post} comment={comment} onLoading={setLoading} />
			)}
		</li>
	);
};

CommentDetail.propTypes = {
	index: PropTypes.number,
	post: PropTypes.object,
	comment: PropTypes.object,
};
