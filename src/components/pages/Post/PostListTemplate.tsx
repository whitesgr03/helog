// Styles
import styles from './PostList.module.css';
import imageStyles from '../../../styles/image.module.css';
import skeleton from '../../../styles/skeleton.module.css';

export const PostListTemplate = ({ count }: { count: number }) => {
	return (
		<ul className={`${styles['post-list']}`}>
			{[...Array(count).keys()].map(index => (
				<li className={styles.item} key={index}>
					<div className={styles.info}>
						<span className={skeleton.loading}>username</span>
						<span className={skeleton.loading}>MMMM d, y</span>
					</div>
					<div className={`${skeleton.loading} ${imageStyles.content}`} />
					<span className={skeleton.loading}>title</span>
				</li>
			))}
		</ul>
	);
};
