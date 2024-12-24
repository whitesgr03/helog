// Packages
import { Link, useLocation } from 'react-router-dom';

// Styles
import style from '../../styles/layout/Error.module.css';
import image from '../../styles/utils/image.module.css';

export const Error = () => {
	const { state } = useLocation();

	return (
		<div className={style.error}>
			<span className={`${image.icon} ${style.alert}`} />
			<div className={style.message}>
				<p>Our apologies, there has been an error.</p>
				{state?.customMessage ? (
					<p>{state?.error}</p>
				) : (
					<p>
						Please come back later, or if you have any questions, contact us.
					</p>
				)}
			</div>
			{state?.previousPath && (
				<Link to={state.previousPath} className={style.link}>
					Go Back
				</Link>
			)}
			<Link to="/" className={style.link}>
				Back to Home Page.
			</Link>
		</div>
	);
};
