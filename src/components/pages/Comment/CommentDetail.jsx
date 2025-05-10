import { useState } from 'react';
import PropTypes from 'prop-types';
import { useOutletContext, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

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
import {
	queryPostDetailOption,
	queryClient,
	infiniteQueryRepliesOption,
} from '../../../utils/queryOptions';

export const CommentDetail = ({ index, comment }) => {
	const { onAlert, onActiveModal } = useOutletContext();
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyBox, setShowReplyBox] = useState(false);
	const [showEditBox, setShowEditBox] = useState(false);

	const { postId } = useParams();

	const {
		data: replies,
		isFetching,
		isFetchNextPageError,
	} = useInfiniteQuery({
		...infiniteQueryRepliesOption(comment._id, comment.child.length),
		meta: {
			errorAlert: () => {
				onAlert({
					message:
						'Loading the replies has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				});
				!isFetchNextPageError && setShowReplies(false);
			},
		},
		enabled: showReplies,
	});

	const { data: user } = queryClient.getQueryData(['userInfo']) ?? {};
	const { data: post } = useQuery(queryPostDetailOption(postId));

	const isCommentOwner = user?.username === comment.author.username;
	const isPostAuthor = post?.author.username === comment.author.username;

	const handleDelete = () => {
		setShowEditBox(false);
		onActiveModal({
			component: (
				<CommentDelete
					commentId={comment._id}
					onAlert={onAlert}
					onActiveModal={onActiveModal}
				/>
			),
		});
	};

	const handleShowReplies = async () => setShowReplies(!showReplies);
	const handleShowEditBox = () => setShowEditBox(!showEditBox);
	const handleShowReplyBox = () => setShowReplyBox(!showReplyBox);

	return (
		<li>
			<div
				className={`${styles.container} ${
					!comment.deleted && isPostAuthor ? styles.author : ''
				} ${!comment.deleted && isCommentOwner ? styles.user : ''}`}
				data-testid="container"
			>
				<div className={styles['content-top']}>
					{!comment.deleted && (
						<div className={styles['interactive-bar']}>
							{!isPostAuthor && (
								<em className={styles.highlight}>POST AUTHOR</em>
							)}
							{(isCommentOwner || user?.isAdmin) && (
								<div className={styles['interactive-button-wrap']}>
									<button
										className={styles['interactive-button']}
										onClick={handleDelete}
										data-testid="delete-button"
									>
										<span
											className={`${imageStyles.icon} ${styles['delete-icon']}`}
										/>
									</button>
									<button
										className={styles['interactive-button']}
										onClick={handleShowEditBox}
										data-testid="edit-button"
									>
										<span
											className={`${imageStyles.icon} ${styles['edit-icon']}`}
										/>
									</button>
								</div>
							)}
						</div>
					)}
					<div className={styles['info-bar']}>
						<div className={styles.info}>
							<span>{`[${index + 1}]`}</span>
							<div className={styles.avatar}>
								{!comment.deleted && (
									<span>{comment.author.username.charAt(0).toUpperCase()}</span>
								)}
							</div>
							<span className={styles.username}>
								{!comment.deleted ? comment.author.username : '[deleted]'}
							</span>
						</div>
						<div className={styles.time}>
							{`${formatDistanceToNow(comment.updatedAt)} ago `}
							{new Date(comment.createdAt).getTime() !==
							new Date(comment.updatedAt).getTime()
								? '(edited)'
								: ''}
						</div>
					</div>
				</div>
				{showEditBox ? (
					<CommentUpdate
						commentId={comment._id}
						content={comment.content}
						onCloseCommentBox={handleShowEditBox}
					/>
				) : (
					<p className={styles.content}>{comment.content}</p>
				)}
				<div
					className={`${styles['content-bottom']} ${showReplyBox && styles['reply-active']}`}
				>
					{user && !comment.deleted && (
						<>
							{!showReplyBox ? (
								<button
									className={styles['reply-btn']}
									onClick={handleShowReplyBox}
								>
									Reply
								</button>
							) : (
								<ReplyCreate
									commentId={comment._id}
									onShowReplyBox={handleShowReplyBox}
								/>
							)}
						</>
					)}
					{!!comment.child.length && (
						<>
							<button
								className={styles['reply-list-btn']}
								onClick={handleShowReplies}
								data-testid="reply-icon"
							>
								<span
									className={`${showReplies && replies ? styles.active : ''} ${styles['reply-list-icon']} ${imageStyles.icon}`}
								/>
								{isFetching ? (
									<span
										className={`${imageStyles.icon} ${buttonStyles['load']}`}
										data-testid="loading-icon"
									/>
								) : (
									comment.child.length
								)}
							</button>
						</>
					)}
				</div>
			</div>
			{showReplies && (
				<Replies repliesCount={comment.child.length} commentId={comment._id} />
			)}
		</li>
	);
};

CommentDetail.propTypes = {
	index: PropTypes.number,
	comment: PropTypes.object,
};
