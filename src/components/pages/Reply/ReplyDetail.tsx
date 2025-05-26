// Packages
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

// Styles
import commentDetailStyles from '../Comment/CommentDetail.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { ReplyCreate } from './ReplyCreate';
import { ReplyUpdate } from './ReplyUpdate';
import { ReplyDelete } from './ReplyDelete';

// Utils
import {
	queryPostDetailOption,
	queryUserInfoOption,
} from '../../../utils/queryOptions';

// Context
import { useAppDataAPI } from '../App/AppContext';

// Type
import { Reply } from './Replies';

interface ReplyDetailProps {
	index: number;
	commentId: string;
	postId: string;
	reply: Reply;
	onScroll?: (replyId: Reply['_id']) => void;
}

export const ReplyDetail = ({
	index,
	postId,
	commentId,
	reply,
	onScroll,
}: ReplyDetailProps) => {
	const { onModal } = useAppDataAPI();
	const [showReplyBox, setShowReplyBox] = useState(false);
	const [showEditBox, setShowEditBox] = useState(false);

	const { data: post } = useQuery(queryPostDetailOption(postId));
	const { data: user } = useQuery({ ...queryUserInfoOption, enabled: false });

	const isCommentOwner = user?.username === reply.author.username;
	const isPostAuthor = post?.author.username === reply.author.username;

	const handleShowEditBox = () => setShowEditBox(!showEditBox);
	const handleShowReplyBox = () => setShowReplyBox(!showReplyBox);

	const handleDelete = () => {
		setShowEditBox(false);
		onModal({
			component: <ReplyDelete commentId={commentId} replyId={reply._id} />,
			clickBgToClose: true,
		});
	};

	const handleScrollToRepliedUser = () =>
		onScroll && reply.reply && onScroll(reply.reply._id);

	return (
		<li>
			<div
				className={`${commentDetailStyles.container} ${
					!reply.deleted && isPostAuthor ? commentDetailStyles.author : ''
				} ${!reply.deleted && isCommentOwner ? commentDetailStyles.user : ''}`}
				data-testid="container"
			>
				<div className={commentDetailStyles['content-top']}>
					{!reply.deleted && (
						<div className={commentDetailStyles['interactive-bar']}>
							{isPostAuthor && (
								<em className={commentDetailStyles.highlight}>POST AUTHOR</em>
							)}
							{(isCommentOwner || user?.isAdmin) && (
								<div className={commentDetailStyles['interactive-button-wrap']}>
									<button
										className={commentDetailStyles['interactive-button']}
										onClick={handleDelete}
										data-testid="delete-button"
									>
										<span
											className={`${imageStyles.icon} ${commentDetailStyles['delete-icon']}`}
										/>
									</button>
									<button
										className={commentDetailStyles['interactive-button']}
										onClick={handleShowEditBox}
										data-testid="edit-button"
									>
										<span
											className={`${imageStyles.icon} ${commentDetailStyles['edit-icon']}`}
										/>
									</button>
								</div>
							)}
						</div>
					)}
					<div className={commentDetailStyles['info-bar']}>
						<div className={commentDetailStyles.info}>
							<span>{`[${index + 1}]`}</span>
							<div className={commentDetailStyles.avatar}>
								{!reply.deleted && (
									<span>{reply.author.username.charAt(0).toUpperCase()}</span>
								)}
							</div>
							<span className={commentDetailStyles.username}>
								{!reply.deleted ? reply.author.username : '[deleted]'}
							</span>
						</div>
						<div className={commentDetailStyles.time}>
							{`${formatDistanceToNow(reply.updatedAt)} ago `}
							{new Date(reply.createdAt).getTime() !==
							new Date(reply.updatedAt).getTime()
								? '(edited)'
								: ''}
						</div>
					</div>
				</div>

				{showEditBox ? (
					<ReplyUpdate
						commentId={commentId}
						replyId={reply._id}
						content={reply.content}
						onCloseCommentBox={handleShowEditBox}
					/>
				) : (
					<div className={commentDetailStyles.content}>
						{!reply.deleted && reply?.reply && (
							<button
								className={commentDetailStyles['reply-tag']}
								onClick={handleScrollToRepliedUser}
							>
								{reply.reply.deleted
									? `@deleted`
									: `@${reply.reply.author.username}`}
							</button>
						)}
						<p>{reply.content}</p>
					</div>
				)}
				<div
					className={`${commentDetailStyles['content-bottom']} ${showReplyBox && commentDetailStyles['reply-active']}`}
				>
					{user && !reply.deleted && (
						<>
							{!showReplyBox ? (
								<button
									className={commentDetailStyles['reply-btn']}
									onClick={handleShowReplyBox}
								>
									Reply
								</button>
							) : (
								<ReplyCreate
									commentId={commentId}
									replyId={reply._id}
									onShowReplyBox={handleShowReplyBox}
								/>
							)}
						</>
					)}
				</div>
			</div>
		</li>
	);
};
