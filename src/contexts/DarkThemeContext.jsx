import { useState, createContext } from "react";
import PropTypes from "prop-types";

const setColorScheme = () => {
	const darkTheme =
		window.matchMedia("(prefers-color-scheme: dark)")?.matches ?? false;
	localStorage.setItem("darkTheme", JSON.stringify(darkTheme));
	return darkTheme;
};

const DarkThemeContext = createContext();

const DarkThemeProvider = ({ children }) => {
	const [darkTheme, setDarkTheme] = useState(
		JSON.parse(localStorage.getItem("darkTheme")) ?? setColorScheme
	);

	const handleThemeColor = () => {
		localStorage.setItem("darkTheme", JSON.stringify(!darkTheme));
		setDarkTheme(!darkTheme);
	};

	return (
		<DarkThemeContext.Provider value={[darkTheme, handleThemeColor]}>
			{children}
		</DarkThemeContext.Provider>
	);
};

DarkThemeProvider.propTypes = {
	children: PropTypes.node,
};

export { DarkThemeProvider, DarkThemeContext };
