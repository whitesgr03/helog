// Packages
import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from '../Comment/Comments.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { ReplyDetail } from './ReplyDetail';
import { Loading } from '../../utils/Loading';

// Utils
import { infiniteQueryRepliesOption } from '../../../utils/queryOptions';

interface RepliesProps {
	commentId: string;
	postId: string;
	repliesCount: number;
	renderRepliesCount: number;
	onAddRenderRepliesCount: () => void;
}

export interface Reply {
	_id: string;
	author: {
		username: string;
	};
	post: string;
	parent: string;
	child: string[];
	reply?: Reply;
	content: string;
	deleted: boolean;
	updatedAt: Date;
	createdAt: Date;
}

export interface ReplyData {
	pages: {
		success: boolean;
		message: string;
		data: Reply[];
	}[];
	pageParams: number[];
}

export const Replies = ({
	postId,
	commentId,
	repliesCount,
	renderRepliesCount,
	onAddRenderRepliesCount,
}: RepliesProps) => {
	const repliesRef = useRef<HTMLDivElement[]>([]);
	const waitForScrollRef = useRef<NodeJS.Timeout>();

	const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
		useInfiniteQuery({
			...infiniteQueryRepliesOption(commentId, repliesCount),
		});

	const replies: Reply[] = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data),
		[],
	);

	const handleScroll = (targetId: string) => {
		const target = repliesRef.current.find(reply => reply.id === targetId);

		const handleShake = () => {
			clearTimeout(waitForScrollRef.current);

			waitForScrollRef.current = setTimeout(() => {
				target?.classList.add(styles.shake);
				window.removeEventListener('scroll', handleShake);
			}, 100);
		};

		const handleAnimationEnd = () => {
			target?.classList.remove(styles.shake);
			target?.removeEventListener('animationend', handleAnimationEnd);
		};

		window.addEventListener('scroll', handleShake);

		target?.addEventListener('animationend', handleAnimationEnd);

		target?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	};

	const handleRenderNextPage = () => {
		replies.length <= renderRepliesCount && fetchNextPage();
		onAddRenderRepliesCount();
	};

	return (
		<div className={styles.replies}>
			<div className={styles.content}>
				<ul>
					{replies.slice(0, renderRepliesCount).map((reply, index) => (
						<div
							key={reply._id}
							id={reply._id}
							ref={(element: HTMLDivElement) =>
								(repliesRef.current[index] = element)
							}
							data-testid="reply"
						>
							<ReplyDetail
								index={index}
								postId={postId}
								commentId={commentId}
								reply={reply}
								onScroll={reply.reply ? handleScroll : undefined}
							/>
						</div>
					))}
				</ul>
				{isFetchingNextPage ? (
					<Loading text={'Loading more replies ...'} />
				) : (
					(replies?.length > renderRepliesCount || hasNextPage) && (
						<button
							className={`${buttonStyles.content} ${buttonStyles.more}`}
							onClick={handleRenderNextPage}
						>
							Show more replies
						</button>
					)
				)}
			</div>
		</div>
	);
};
