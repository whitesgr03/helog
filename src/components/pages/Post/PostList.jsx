// Modules
import { useState, useRef, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from './PostList.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Posts } from './Posts';
import { Loading } from '../../utils/Loading';

// Utils
import { infiniteQueryPostsOption } from '../../../utils/queryOptions';

// Context
import { useAppDataAPI } from '../App/AppContext';

export const PostList = () => {
	const { onAlert } = useAppDataAPI();
	const { pathname: previousPath } = useLocation();
	const [renderPostsCount, setRenderPostsCount] = useState(10);
	const postListRef = useRef(null);

	const {
		isPending,
		isError,
		data,
		fetchNextPage,
		isFetchingNextPage,
		isFetchNextPageError,
		hasNextPage,
	} = useInfiniteQuery({
		...infiniteQueryPostsOption,
		refetchOnWindowFocus: true,
		meta: {
			errorAlert: () => {
				hasNextPage &&
					onAlert({
						message:
							'Loading the posts has some errors occur, please try again later.',
						error: true,
						delay: 4000,
					});
			},
		},
	});

	const posts = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data.posts),
		[],
	);

	useEffect(() => {
		const handleRenderNextPage = () => {
			posts.length <= renderPostsCount && fetchNextPage();
			setRenderPostsCount(renderPostsCount + 10);
		};
		const handleScroll = async () => {
			const targetRect = postListRef.current.getBoundingClientRect();

			const isScrollToBottom = targetRect.bottom <= window.innerHeight;

			!isFetchingNextPage && isScrollToBottom && handleRenderNextPage();
		};

		!isError &&
			(posts?.length > renderPostsCount || hasNextPage) &&
			window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [
		isError,
		posts,
		renderPostsCount,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	]);

	return (
		<div className={styles['post-list']}>
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
						<Posts posts={posts.slice(0, renderPostsCount)} />
					</div>
					{isFetchingNextPage ? (
						<Loading text={'Loading more posts ...'} />
					) : (
						isFetchNextPageError && (
							<button
								className={`${buttonStyles.content} ${buttonStyles.more}`}
								onClick={() => fetchNextPage()}
							>
								Click here to show more posts
							</button>
						)
					)}
				</>
			)}
		</div>
	);
};
