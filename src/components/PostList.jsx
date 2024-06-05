import style from "../styles/PostList.module.css";

import Posts from "./Posts";

const PostList = () => {
	return (
		<div className={style.postList}>
			<Posts />
		</div>
	);
};

export default PostList;
