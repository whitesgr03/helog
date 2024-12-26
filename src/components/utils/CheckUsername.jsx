import { useOutletContext, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const CheckUsername = ({ children }) => {
	const { user } = useOutletContext();

	return (
		<>
			{user && !user.username ? <Navigate to="/" replace={true} /> : children}
		</>
	);
};

CheckUsername.propTypes = {
	children: PropTypes.node,
};
