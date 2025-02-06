// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// Styles
import styles from '../Comment/CommentDetail.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { ReplyCreate } from '../Reply/ReplyCreate';
import { ReplyUpdate } from './ReplyUpdate';
import { ReplyDelete } from './ReplyDelete';

export const ReplyDetail = ({ index, post, comment, reply }) => {
	const { user, onAlert, onActiveModal, onUpdatePost } = useOutletContext();
	const [showReplyBox, setShowReplyBox] = useState(false);
	const [showEditBox, setShowEditBox] = useState(false);

	const isCommentOwner = user?.username === reply?.author?.username;
	const isPostAuthor = post.author.username === reply?.author?.username;

	const handleShowEditBox = () => {
		setShowEditBox(!showEditBox);
	};
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

	const handleScrollToReplier = () => {
		const targetId = reply.reply._id;
		const element = document.getElementById(targetId);
		const target = element.getBoundingClientRect();

		const windowTop = document.documentElement.scrollTop;

		const windowHalfHeight = document.documentElement.clientHeight / 2;
		const targetHalfHeight = target.height / 2;
		const targetCenter =
			windowTop + target.top - windowHalfHeight + targetHalfHeight;

		const handleScroll = () => {
			const currentTargetTop = element.getBoundingClientRect().top;
			const isTargetCenter =
				currentTargetTop - windowHalfHeight + targetHalfHeight >= 0;

			isTargetCenter && element.classList.add(styles.shake);

			isTargetCenter && window.removeEventListener('scroll', handleScroll);
		};

		window.addEventListener('scroll', handleScroll);

		window.scrollTo({
			top: targetCenter,
			behavior: 'smooth',
		});
	};

	return (
		<li id={reply._id} onAnimationEnd={e => (e.target.className = '')}>
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
						<span className={styles.index}>{`[${index + 1}]`}</span>
						<div className={styles.avatar}>
							{!reply.deleted && (
								<span>{reply.author.username.charAt(0).toUpperCase()}</span>
							)}
						</div>
						<strong title={!reply.deleted ? reply?.author?.username : ''}>
							{!reply.deleted ? reply?.author?.username : '[deleted]'}
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
								title={reply.reply.author.username}
								onClick={handleScrollToReplier}
							>
								{reply.reply.deleted
									? `@deleted`
									: `@${reply.reply.author.username}`}
							</button>
						)}
						<p className={styles.comment}>{reply.content}</p>
					</div>
				)}

				<div className={styles['button-wrap']}>
					{user && !reply.deleted && (
						<button
							className={styles['add-reply-btn']}
							onClick={handleShowReplyBox}
						>
							Reply
						</button>
					)}
				</div>
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
	post: PropTypes.object,
	comment: PropTypes.object,
	reply: PropTypes.object,
};
