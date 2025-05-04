// Modules
import { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from './PostList.module.css';
import imageStyles from '../../../styles/image.module.css';
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
		const countPosts = data?.pages.at(-1).data.countPosts;
		const skipPosts = data?.pageParams.at(-1) + 10;

		const handleScroll = async () => {
			const targetRect = postListRef.current.getBoundingClientRect();

			const isScrollToDivBottom = targetRect.bottom <= window.innerHeight;

			!isFetchingNextPage && isScrollToDivBottom && fetchNextPage();
		};

		countPosts > skipPosts && window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isFetchingNextPage, data, fetchNextPage]);

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
					{isFetchingNextPage && (
						<div className={styles['load-btn']}>
							Loading posts ...
							<span className={`${imageStyles.icon} ${buttonStyles['load']}`} />
						</div>
					)}
				</>
			)}
		</div>
	);
};
