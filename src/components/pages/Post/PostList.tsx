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
				<ul>
					{posts.map(post => (
						<li className={styles.item} key={post._id}>
							<div className={styles.info}>
								<p className={styles.author}>
									<strong>{post.author.username}</strong>
								</p>
								<p className={styles['date-time']}>
									<em>{format(post.updatedAt, 'MMMM d, y')}</em>
								</p>
							</div>

							<Link to={`../posts/${post._id}`}>
								<PostMainImage title={post.title} url={post.mainImage} />
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
				<p>There are not posts.</p>
			)}
		</>
	);
};
