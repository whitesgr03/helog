// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useOutletContext, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

// Styles
import styles from '../Comment/CommentDetail.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { ReplyCreate } from '../Reply/ReplyCreate';
import { ReplyUpdate } from './ReplyUpdate';
import { ReplyDelete } from './ReplyDelete';

// Utils
import { queryPostDetailOption } from '../../../utils/queryOptions';

export const ReplyDetail = ({ index, commentId, reply, onScroll }) => {
	const [showReplyBox, setShowReplyBox] = useState(false);
	const [showEditBox, setShowEditBox] = useState(false);

	const { postId } = useParams();
	const { data: post } = useQuery(queryPostDetailOption(postId));

	const isCommentOwner = user?.username === reply.author.username;
	const isPostAuthor = post.author.username === reply.author.username;

	const handleShowEditBox = () => setShowEditBox(!showEditBox);
	const handleShowReplyBox = () => setShowReplyBox(!showReplyBox);

	const handleDelete = () => {
		setShowEditBox(false);
		onActiveModal({
			component: (
				<ReplyDelete
					post={post}
					commentId={comment._id}
					replyId={reply._id}
					onActiveModal={onActiveModal}
					onAlert={onAlert}
					onUpdatePost={onUpdatePost}
				/>
			),
		});
	};

	const handleScrollToRepliedUser = () => onScroll(reply.reply._id);

	return (
		<li>
			<div
				className={`${styles.container} ${
					!reply.deleted && isPostAuthor ? styles.author : ''
				} ${!reply.deleted && isCommentOwner ? styles.user : ''}`}
				data-testid="container"
			>
				{!reply.deleted && (
					<div className={styles['button-wrap']}>
						{isPostAuthor && <em className={styles.highlight}>POST AUTHOR</em>}
						{(isCommentOwner || user?.isAdmin) && (
							<div className={styles['comment-button']}>
								<button onClick={handleDelete} data-testid="delete-button">
									<span className={`${imageStyles.icon} ${styles.delete}`} />
								</button>
								<button onClick={handleShowEditBox} data-testid="edit-button">
									<span className={`${imageStyles.icon} ${styles.edit}`} />
								</button>
							</div>
						)}
					</div>
				)}
				<div className={styles['info-wrap']}>
					<div className={styles.info}>
						<span className={styles.index}>{`[${index + 1}]`}</span>
						<div className={styles.avatar}>
							{!reply.deleted && (
								<span>{reply.author.username.charAt(0).toUpperCase()}</span>
							)}
						</div>
						<strong>
							{!reply.deleted ? reply.author.username : '[deleted]'}
						</strong>
					</div>
					<div className={styles.time}>
						{`${formatDistanceToNow(reply.updatedAt)} ago `}
						{new Date(reply.createdAt).getTime() !==
						new Date(reply.updatedAt).getTime()
							? '(edited)'
							: ''}
					</div>
				</div>

				{showEditBox ? (
					<div className={styles['edit-box-wrap']}>
						<ReplyUpdate
							post={post}
							commentId={comment._id}
							reply={reply}
							onUpdatePost={onUpdatePost}
							onCloseCommentBox={handleShowEditBox}
						/>
					</div>
				) : (
					<div className={styles.content}>
						{!reply.deleted && reply?.reply && (
							<button
								className={styles.tag}
								onClick={handleScrollToRepliedUser}
							>
								{reply.reply.deleted
									? `@deleted`
									: `@${reply.reply.author.username}`}
							</button>
						)}
						<p className={styles.comment}>{reply.content}</p>
					</div>
				)}
				{user && !reply.deleted && (
					<button
						className={styles['add-reply-btn']}
						onClick={handleShowReplyBox}
					>
						Reply
					</button>
				)}
			</div>

			{showReplyBox && (
				<div className={styles['comment-box-wrap']}>
					<ReplyCreate
						post={post}
						comment={comment}
						reply={reply}
						onUpdatePost={onUpdatePost}
						onCloseReplyBox={handleShowReplyBox}
					/>
				</div>
			)}
		</li>
	);
};

ReplyDetail.propTypes = {
	index: PropTypes.number,
	commentId: PropTypes.string,
	reply: PropTypes.object,
	onScroll: PropTypes.func,
};
