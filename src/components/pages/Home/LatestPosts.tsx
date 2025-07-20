// Packages
import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

// Styles
import styles from './LatestPosts.module.css';
import buttonStyles from '../../../styles/button.module.css';

// Components
import { PostList } from '../Post/PostList';
import { Loading } from '../../utils/Loading';

// Utils
import { infiniteQueryPostsOption } from '../../../utils/queryOptions';

// Context
import { useAppDataAPI } from '../App/AppContext';

export const LatestPosts = () => {
	const { onAlert } = useAppDataAPI();
	const [isManuallyRefetch, setIsManuallyRefetch] = useState(false);

	const { isPending, isError, data, refetch } = useInfiniteQuery({
		...infiniteQueryPostsOption(),
		meta: {
			errorAlert: () => {
				isManuallyRefetch &&
					onAlert([
						{
							message:
								'Loading the posts has some errors occur, please try again later.',
							error: true,
							delay: 4000,
						},
					]);
				setIsManuallyRefetch(false);
			},
		},
	});

	const posts = data?.pages[0].data.posts.slice(0, 4);

	const handleManuallyRefetch = () => {
		refetch();
		setIsManuallyRefetch(true);
	};

	return (
		<div className={styles['latest-posts']}>
			<h2>Latest Posts</h2>
			{isError && !posts ? (
				<button
					className={`${buttonStyles.content} ${buttonStyles.more}`}
					onClick={handleManuallyRefetch}
				>
					Click here to load posts
				</button>
			) : isPending ? (
				<Loading text={'Loading posts ...'} />
			) : (
				<PostList posts={posts} />
			)}
		</div>
	);
};
