import { createContext, useContext } from "react";
import PropTypes from "prop-types";

const Context = createContext();

const UserContext = () => useContext(Context);

const UserProvider = ({ children, ...props }) => (
	<Context.Provider value={props}>{children}</Context.Provider>
);

UserProvider.propTypes = {
	children: PropTypes.node,
};

export { UserProvider, UserContext };
