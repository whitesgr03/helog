// Modules
import { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
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

	const {
		isPending,
		isError,
		data,
		refetch,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		...infiniteQueryPostsOption,
		retry: (failureCount, error) => {
			failureCount >= 3 &&
				error &&
				onAlert({
					message:
						'Loading the posts has some errors occur, please try again later.',
					error: false,
					delay: 4000,
				});
			return failureCount < 3;
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
				<button
					className={`${buttonStyles.content} ${buttonStyles.more}`}
					onClick={() => refetch()}
				>
					Click here to load posts
				</button>
			) : isPending ? (
				<Loading text="Loading Posts..." />
			) : (
				<>
					<div className={styles.container} ref={postListRef}>
						<Posts posts={posts} />
					</div>
					{isFetchingNextPage && <Loading text={'Loading more posts ...'} />}
				</>
			)}
		</div>
	);
};
