import PropTypes from "prop-types";
import { useOutletContext, Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
	const { user } = useOutletContext();

	return <>{user ? <Navigate to=".." replace={true} /> : children}</>;
};

AuthGuard.propTypes = {
	children: PropTypes.node,
};

export default AuthGuard;
