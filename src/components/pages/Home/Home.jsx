// Packages
import { Link, useOutletContext } from 'react-router-dom';

// Styles
import styles from './Home.module.css';
import imageStyles from '../../../styles/image.module.css';

// Components
import { Posts } from '../Post/Posts';

// Variables
import url from '../../../assets/hero.jpg';

export const Home = () => {
	const { posts } = useOutletContext();
	return (
		<div className={styles.home}>
			<div className={styles.container}>
				<div className={styles.wrap}>
					<div className={imageStyles.content}>
						<img src={url} />
					</div>
				</div>
				<div className={styles.content}>
					<h2 className={styles.title}>
						Welcome to HeLog: A Daily Stories For Reader
					</h2>
					<p>
						Ever felt like your daily experiences are worth sharing? Those
						little moments that make you smile, the challenges that shaped you,
						or the random thoughts that keep you up at night? Well, you're not
						alone, and that's exactly why HeLog exists. Think of HeLog as your
						digital diary that connects with others. It's where your everyday
						experiences become part of a larger tapestry of human stories. No
						filters, no pretense - just real people sharing real moments. Let us
						make your story part of the world's story.
					</p>
					<Link to={'../posts'} className={styles.link}>
						All Posts
						<span
							className={`${imageStyles.icon} ${styles.doubleArrowRight}`}
						/>
					</Link>
				</div>
			</div>
			<div className={styles['latest-posts']}>
				<h2>Latest Posts</h2>
				<Posts posts={posts} limit={4} />
			</div>
		</div>
	);
};
