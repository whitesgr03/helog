// Packages
import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
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

export const Comments = () => {
	const { postId } = useParams();
	const { onAlert } = useOutletContext();
	const [isManuallyRefetch, setIsManuallyRefetch] = useState();
	const [renderCommentsCount, setRenderCommentsCount] = useState(10);

	const commentListRef = useRef(null);

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
					onAlert({
						message:
							'Loading the comments has some errors occur, please try again later.',
						error: true,
						delay: 4000,
					});
				isManuallyRefetch && setIsManuallyRefetch(false);
			},
		},
	});

	const commentAndReplyCounts = data?.pages.at(-1).data.commentAndReplyCounts;

	const comments = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data.comments),
		[],
	);

	const handleManuallyRefetch = () => {
		refetch();
		setIsManuallyRefetch(true);
	};

	useEffect(() => {
		const handleRenderNextPage = () => {
			comments.length <= renderCommentsCount && fetchNextPage();
			setRenderCommentsCount(value => value + 10);
		};

		const handleScroll = async () => {
			const targetRect = commentListRef.current.getBoundingClientRect();

			const isScrollToBottom = targetRect.bottom <= window.innerHeight;

			!isFetchingNextPage && isScrollToBottom && handleRenderNextPage();
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
						<div className={styles['comment-box-wrap']}>
							<CommentCreate />
						</div>
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
