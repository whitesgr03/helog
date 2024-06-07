import PropTypes from "prop-types";

import style from "../styles/Comments.module.css";
import useFetch from "../hooks/useFetch";

import CommentDetail from "./CommentDetail";
import Loading from "./Loading";
import Error from "./Error";

const GET_POSTS_URL = "http://localhost:3000/blog/posts";

const Comments = ({ postAuthor, postId }) => {
	const { data, error, loading } = useFetch(
		`${GET_POSTS_URL}/${postId}/comments`
	);

	const comments = data ? data : [];

	const parentComments = comments.filter(comment => !comment.reply);
	const replyComments = comments.filter(comment => comment.reply);

	const items = parentComments.map(comment => {
		const replyList = [...replyComments].filter(
			rComment =>
				rComment.reply === comment._id &&
				replyComments.splice(
					replyComments.findIndex(
						reply => reply._id === rComment._id
					),
					1
				)
		);

		const isPostAuthor = postAuthor === comment.author.name;

		return (
			<CommentDetail
				key={comment._id}
				comment={comment}
				replyList={replyList}
				isPostAuthor={isPostAuthor}
			>
				{replyList.map(reply => (
					<CommentDetail
						key={reply._id}
						comment={reply}
						isPostAuthor={isPostAuthor}
					/>
				))}
			</CommentDetail>
		);
	});
	return (
		<div className={style.comments}>
			<h3>Comments</h3>
			{loading ? (
				<Loading />
			) : error ? (
				<Error message={error} />
			) : (
				<>
					{items.length > 0 ? (
						<ul>{items}</ul>
					) : (
						<p>There are not comments.</p>
					)}
				</>
			)}
		</div>
	);
};

Comments.propTypes = {
	postAuthor: PropTypes.string,
	postId: PropTypes.string,
};

export default Comments;
