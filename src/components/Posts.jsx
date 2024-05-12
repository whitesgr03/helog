import style from "../styles/Posts.module.css";

const Posts = () => {
	return (
		<ul className={style.posts}>
			<li className={style.item}>
				<img src="#" alt="Post Title" />
				<strong className={style.dateTime}>Post Date Time</strong>
				<h2>Post Title</h2>
				<p>Post Content</p>
			</li>
		</ul>
	);
};

export default Posts;
