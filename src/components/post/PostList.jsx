// Styles
import style from '../../styles/post/PostList.module.css';

// Components
import Posts from "./Posts";

const PostList = () => {
	return (
		<div className={style.postList}>
			<Posts />
		</div>
	);
};

export default PostList;
