// Packages
import { Link } from 'react-router-dom';

// Styles
import styles from './Home.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Posts } from '../Post/Posts';

// Variables
import url from '../../../assets/hero.jpg';

export const Home = () => {
	return (
		<div className={styles.home}>
			<div className={styles.container}>
				<div className={styles.wrap}>
					<div className={imageStyles.content}>
						<img src={url} />
					</div>
				</div>
				<div className={styles.content}>
					<h2 className={styles.title}>A Daily Stories For Reader</h2>
					<p>
						The personal blog is an ongoing online diary or commentary written
						by an individual, rather than a corporation or organization. While
						the vast majority of personal blogs attract very few readers, other
						than the blogger&apos;s immediate family and friends, a small number
						of personal blogs have become popular, to the point that they have
						attracted lucrative advertising sponsorship. A tiny number of
						personal bloggers have become famous, both in the online community
						and in the real world.
					</p>
					<Link to={'/posts'} className={styles.link}>
						<span>Latest </span>
						<span>All </span>Posts
						<span
							className={`${imageStyles.icon} ${styles.doubleArrowRight}`}
						/>
					</Link>
				</div>
			</div>
			<div className={styles['latest-posts']}>
				<h2>Latest Posts</h2>
				<Posts limit={4} />
			</div>
		</div>
	);
};
