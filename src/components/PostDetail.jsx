import style from "../styles/PostDetail.module.css";

const PostDetail = () => {
	return (
		<ul className={style.postDetail}>
			<li className={style.item}>
				<strong className={style.dateTime}>Post Date Time</strong>
				<h2>Post Title</h2>
				<img src="#" alt="Post Title" />
				<p>Post Content</p>
			</li>
		</ul>
	);
};

export default PostDetail;
