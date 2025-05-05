// Modules
import { useRef, useEffect } from 'react';
import { Navigate, useLocation, useOutletContext } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from './PostList.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { Posts } from './Posts';
import { Loading } from '../../utils/Loading';

// Utils
import { infiniteQueryPostsOption } from '../../../utils/queryOptions';

export const PostList = () => {
	const { onAlert } = useOutletContext();
	const { pathname: previousPath } = useLocation();

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
						error: false,
						delay: 4000,
					});
			},
		},
	});

	const postListRef = useRef(null);

	const posts = data?.pages.reduce(
		(accumulator, current) => accumulator.concat(current.data.posts),
		[],
	);

	useEffect(() => {
		const handleScroll = async () => {
			const targetRect = postListRef.current.getBoundingClientRect();

			const isScrollToBottom = targetRect.bottom <= window.innerHeight;

			!isFetchingNextPage && isScrollToBottom && fetchNextPage();
		};

		!isError && hasNextPage && window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isError, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
						<Posts posts={posts} />
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
