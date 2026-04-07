// Packages
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { lazy, Suspense } from 'react';

// Styles
import styles from './Home.module.css';
import imageStyles from '../../../styles/image.module.css';

// Assets
import url from '../../../assets/hero.jpg';

// Components
import { Loading } from '../../utils/Loading';

// Lazy Components
const LatestPosts = lazy(async () => {
	const { LatestPosts } = await import('./LatestPosts.tsx');
	return { default: LatestPosts };
});

export const Home = () => {
	const isDesktopOrLaptop = useMediaQuery({ minWidth: 700 });
	return (
		<>
			<title>Helog - A public blog for people to share any content</title>
			<meta
				name="description"
				content="Helog provides a free place for you to share all your stories with readers with live commentary."
			/>
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
							little moments that make you smile, the challenges that shaped
							you, or the random thoughts that keep you up at night? Well,
							you're not alone, and that's exactly why HeLog exists. Think of
							HeLog as your digital diary that connects with others. It's where
							your everyday experiences become part of a larger tapestry of
							human stories. No filters, no pretense - just real people sharing
							real moments. Let us make your story part of the world's story.
						</p>
						<Link to={'../posts'} className={styles.link}>
							All Posts
							<span
								className={`${imageStyles.icon} ${styles.doubleArrowRight}`}
							/>
						</Link>
					</div>
				</div>
				{isDesktopOrLaptop && (
					<Suspense fallback={<Loading text={'Loading Posts ...'} />}>
						<LatestPosts />
					</Suspense>
				)}
			</div>
		</>
	);
};
