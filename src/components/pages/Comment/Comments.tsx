// Packages
import { useState } from 'react';
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

const count = 25;

export const Comments = ({ postId }: { postId: string }) => {
	const { onAlert } = useAppDataAPI();
	const [renderCommentsCount, setRenderCommentsCount] = useState(count);

	const {
		isPending,
		isError,
		data,
		refetch,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery(infiniteQueryCommentsOption(postId));

	const commentAndReplyCounts = data?.pages.at(-1).data.commentAndReplyCounts;

	const comments: Comment[] = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data.comments),
		[],
	);

	const handleManualRefetch = async () => {
		const result = await refetch();
		if (result.isError) {
			onAlert([
				{
					message:
						'Loading the comments has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]);
		}
	};

	const handleFetchingNextComments = async () => {
		const result = await fetchNextPage();
		if (result.isSuccess) {
			setRenderCommentsCount(renderCommentsCount + count);
		}
		if (result.isError) {
			onAlert([
				{
					message:
						'Loading the comments has some errors occur, please try again later.',
					error: true,
					delay: 4000,
				},
			]);
		}
	};

	return (
		<div className={styles.comments}>
			{isError && !data?.pages.length ? (
				<button
					className={`${buttonStyles.content} ${buttonStyles.more}`}
					onClick={handleManualRefetch}
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
								<ul>
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
							) : (
								<p>There are not comments.</p>
							)}
						</div>
					</div>
					{isFetchingNextPage ? (
						<Loading text={'Loading more comments ...'} />
					) : comments?.length > renderCommentsCount ? (
						<button
							className={`${buttonStyles.content} ${buttonStyles.more}`}
							onClick={() =>
								setRenderCommentsCount(renderCommentsCount + count)
							}
						>
							Click here to show more comments
						</button>
					) : (
						hasNextPage && (
							<button
								className={`${buttonStyles.content} ${buttonStyles.more}`}
								onClick={handleFetchingNextComments}
							>
								Click here to load more comments
							</button>
						)
					)}
				</>
			)}
		</div>
	);
};
