// Packages
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

// Styles
import styles from './PostList.module.css';

// Component
import { PostMainImage } from './PostMainImage';

export interface PostData {
	_id: string;
	author: {
		username: string;
	};
	title: string;
	mainImage: string;
	updatedAt: Date;
	createdAt: Date;
}

export const PostList = ({ posts }: { posts: PostData[] }) => {
	return (
		<>
			{posts.length > 0 ? (
				<ul className={styles.posts}>
					{posts.map((post, index) => (
						<li key={post._id}>
							<div className={styles.info}>
								<strong className={styles['date-time']}>
									{post.author.username}
								</strong>
								<em>{format(post.updatedAt, 'MMMM d, y')}</em>
							</div>

							<Link to={`../posts/${post._id}`}>
								<PostMainImage url={post.mainImage} index={index} />
							</Link>

							<Link to={`../posts/${post._id}`}>
								<h3 className={styles.title} title={post.title}>
									{post.title}
								</h3>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<p className={styles['no-posts']}>There are not posts.</p>
			)}
		</>
	);
};
