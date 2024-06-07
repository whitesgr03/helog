import { createContext, useContext } from "react";
import PropTypes from "prop-types";

const Context = createContext();

const AppContext = () => useContext(Context);

const AppProvider = ({ children, ...props }) => (
	<Context.Provider value={props}>{children}</Context.Provider>
);

AppProvider.propTypes = {
	children: PropTypes.node,
};

export { AppProvider, AppContext };
