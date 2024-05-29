import { Outlet } from "react-router-dom";

import useFetch from "../hooks/useFetch";

const getPostsUrl = "http://localhost:3000/blog/posts";

const App = () => {
	const posts = useFetch(getPostsUrl);

	return <Outlet context={{ posts }} />;
};

export default App;
