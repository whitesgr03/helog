// Styles
import style from '../../styles/post/PostList.module.css';

// Components
import { Posts } from './Posts';

export const PostList = () => {
	return (
		<div className={style.postList}>
			<Posts />
		</div>
	);
};
