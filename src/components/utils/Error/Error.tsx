// Packages
import { Link, useLocation } from 'react-router-dom';

// Styles
import styles from './Error.module.css';
import imageStyles from '../../../styles/image.module.css';

export const Error = ({ onReGetUser }: { onReGetUser?: () => void }) => {
	const { state } = useLocation();

	return (
		<div className={styles.error}>
			<span className={`${imageStyles.icon} ${styles.alert}`} />
			<div className={styles.message}>
				<p>Our apologies, there has been an error.</p>
				<p>Please try again later, or if you have any questions, contact us.</p>
			</div>
			{state?.previousPath && (
				<Link to={state.previousPath} className={styles.link}>
					Go Back Previous Page
				</Link>
			)}

			<Link
				to="/"
				className={styles.link}
				onClick={() => onReGetUser && onReGetUser()}
			>
				Back to Home Page
			</Link>
		</div>
	);
};
