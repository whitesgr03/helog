// Modules
import { useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from './Posts.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { PostList } from './PostList';
import { Loading } from '../../utils/Loading';

// Utils
import { infiniteQueryPostsOption } from '../../../utils/queryOptions';

// Context
import { useAppDataAPI } from '../App/AppContext';

export const Posts = () => {
	const { onAlert } = useAppDataAPI();
	const { pathname: previousPath } = useLocation();
	const [renderPostsCount, setRenderPostsCount] = useState(10);
	const postListRef = useRef<HTMLDivElement>(null);

	const {
		isPending,
		isError,
		data,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		...infiniteQueryPostsOption(),
		refetchOnWindowFocus: true,
		meta: {
			errorAlert: () => {
				if (hasNextPage) {
					setRenderPostsCount(renderPostsCount - 10);
					onAlert([
						{
							message:
								'Loading the posts has some errors occur, please try again later.',
							error: true,
							delay: 4000,
						},
					]);
				}
			},
		},
	});

	const posts = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data.posts),
		[],
	);

	return (
		<>
			<title>Helog - See today's top stories</title>
			<meta
				name="description"
				content="Today's top content from hundreds of thousands of Helog."
			/>
			<div className={styles.posts}>
				{isError && !data?.pages.length ? (
					<Navigate
						to="/error"
						state={{
							previousPath,
						}}
					/>
				) : isPending ? (
					<Loading text="Loading Posts..." />
				) : (
					<>
						<div className={styles.container} ref={postListRef}>
							<PostList posts={posts.slice(0, renderPostsCount)} />
						</div>
						{isFetchingNextPage ? (
							<Loading text={'Loading more posts ...'} />
						) : posts?.length > renderPostsCount ? (
							<button
								className={`${buttonStyles.content} ${buttonStyles.more}`}
								onClick={() => setRenderPostsCount(renderPostsCount + 10)}
							>
								Click here to show more posts
							</button>
						) : (
							hasNextPage && (
								<button
									className={`${buttonStyles.content} ${buttonStyles.more}`}
									onClick={() => {
										fetchNextPage();
										setRenderPostsCount(renderPostsCount + 10);
									}}
								>
									Click here to load more posts
								</button>
							)
						)}
					</>
				)}
			</div>
		</>
	);
};
