// Packages
import { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from './Comments.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Loading } from '../../utils/Loading';
import { CommentDetail } from './CommentDetail';
import { CommentCreate } from './CommentCreate';

// Utils
import { infiniteQueryCommentsOption } from '../../../utils/queryOptions';

// Context
import { useAppDataAPI } from '../App/AppContext';

export interface Comment {
	_id: string;
	author: {
		username: string;
	} | null;
	post: string;
	parent?: string;
	child: string[];
	reply?: string;
	content: string;
	deleted: boolean;
	updatedAt: Date;
	createdAt: Date;
}

export interface CommentData {
	pages: {
		success: boolean;
		message: string;
		data: {
			comments: Comment[];
			commentsCount: number;
			commentAndReplyCounts: number;
		};
	}[];
	pageParams: number[];
}

export const Comments = ({ postId }: { postId: string }) => {
	const { onAlert } = useAppDataAPI();
	const [isManuallyRefetch, setIsManuallyRefetch] = useState(false);
	const [renderCommentsCount, setRenderCommentsCount] = useState(10);

	const commentListRef = useRef<HTMLUListElement>(null);

	const {
		isPending,
		isError,
		data,
		refetch,
		fetchNextPage,
		isFetchingNextPage,
		isFetchNextPageError,
		hasNextPage,
	} = useInfiniteQuery({
		...infiniteQueryCommentsOption(postId),
		meta: {
			errorAlert: () => {
				(isManuallyRefetch || hasNextPage) &&
					onAlert([
						{
							message:
								'Loading the comments has some errors occur, please try again later.',
							error: true,
							delay: 4000,
						},
					]);
				isManuallyRefetch && setIsManuallyRefetch(false);
			},
		},
	});

	const commentAndReplyCounts = data?.pages.at(-1).data.commentAndReplyCounts;

	const comments: Comment[] = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data.comments),
		[],
	);
	const handleManuallyRefetch = () => {
		refetch();
		setIsManuallyRefetch(true);
	};

	useEffect(() => {
		const renderNextPage = () => {
			comments.length <= renderCommentsCount && fetchNextPage();
			setRenderCommentsCount(value => value + 10);
		};

		const handleScroll = async () => {
			const targetRect = commentListRef.current?.getBoundingClientRect();

			const isScrollToBottom =
				targetRect && targetRect.bottom <= window.innerHeight;

			!isFetchingNextPage && isScrollToBottom && renderNextPage();
		};
		!isError &&
			(comments?.length > renderCommentsCount || hasNextPage) &&
			window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [
		isError,
		comments,
		renderCommentsCount,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	]);

	return (
		<div className={styles.comments}>
			{isError && !data?.pages.length ? (
				<button
					className={`${buttonStyles.content} ${buttonStyles.more}`}
					onClick={handleManuallyRefetch}
				>
					Click here to load comments
				</button>
			) : isPending ? (
				<Loading text={'Loading comments...'} />
			) : (
				<>
					<div className={styles.container}>
						<h3>{!!comments.length && commentAndReplyCounts} Comments</h3>
						<CommentCreate postId={postId} />
						<div className={styles.content}>
							{comments.length ? (
								<>
									<ul ref={commentListRef}>
										{comments
											.slice(0, renderCommentsCount)
											.map((comment, index) => (
												<CommentDetail
													key={comment._id}
													index={index}
													comment={comment}
													postId={postId}
												/>
											))}
									</ul>
									{isFetchingNextPage ? (
										<Loading text={'Loading more comments ...'} />
									) : (
										isFetchNextPageError && (
											<button
												className={`${buttonStyles.content} ${buttonStyles.more}`}
												onClick={() => fetchNextPage()}
											>
												Click here to show more comments
											</button>
										)
									)}
								</>
							) : (
								<p>There are not comments.</p>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};
