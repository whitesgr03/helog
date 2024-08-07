// Packages
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";

// Styles
import style from "../../styles/comment/Comments.module.css";

// Components
import Loading from "../layout/Loading";
import Error from "../layout/Error";
import CommentDetail from "./CommentDetail";
import CommentBox from "./CommentBox";

// Utils
import handleFetch from "../../utils/handleFetch";
import { createComment } from "../../utils/handleComment";

const Comments = ({ postAuthorId, postId }) => {
	const { user, accessToken, handleVerifyTokenExpire, handleExChangeToken } =
		useOutletContext();
	const [comments, setComments] = useState([]);
	const [replies, setReplies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const allComments = (comments.length + replies.length).toLocaleString();

	const handleCreateComment = async fields => {
		const isTokenExpire = await handleVerifyTokenExpire();
		const newAccessToken = isTokenExpire && (await handleExChangeToken());

		const result = await createComment({
			token: newAccessToken || accessToken,
			data: {
				...fields,
				post: postId,
			},
		});

		return result;
	};
	const handleGetComments = useCallback(
		async option => {
			const url = `${
				import.meta.env.VITE_RESOURCE_URL
			}/blog/comments?postId=${postId}`;

			const result = await handleFetch(url, option);

			const handleResult = () => {
				result.success
					? setComments(result.data)
					: setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		},
		[postId]
	);
	const handleGetReplies = useCallback(
		async option => {
			let url = `${
				import.meta.env.VITE_RESOURCE_URL
			}/blog/replies?postId=${postId}`;

			const result = await handleFetch(url, option);

			const handleResult = () => {
				result.success
					? setReplies(result.data)
					: setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		},
		[postId]
	);

	const repliesCopy = [...replies];

	const items = comments.map(comment => {
		const replyList = [...repliesCopy].filter(
			reply =>
				reply.comment === comment._id &&
				repliesCopy.splice(
					repliesCopy.findIndex(
						replyCopy => replyCopy._id === reply._id
					),
					1
				)
		);

		return (
			<CommentDetail
				key={comment._id}
				postId={postId}
				commentId={comment._id}
				comment={comment}
				replyList={replyList.length > 0 ? replyList : null}
				handleGetComments={handleGetComments}
				handleGetReplies={handleGetReplies}
				isCommentAuthor={user?._id === comment?.author?._id}
				isPostAuthor={postAuthorId === comment?.author?._id}
				isDeleted={comment.deleted}
			>
				{replyList.length > 0 && (
					<>
						{replyList.map(reply => (
							<CommentDetail
								key={reply._id}
								postId={postId}
								commentId={comment._id}
								replyId={reply._id}
								comment={reply}
								isCommentAuthor={
									user?._id === reply?.author?._id
								}
								isPostAuthor={
									postAuthorId === reply?.author?._id
								}
								handleGetReplies={handleGetReplies}
								isDeleted={reply.deleted}
							/>
						))}
					</>
				)}
			</CommentDetail>
		);
	});

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetData = async () => {
			await Promise.all([
				handleGetComments({ signal }),
				handleGetReplies({ signal }),
			]);
		};

		handleGetData();

		return () => controller.abort();
	}, [user, handleGetComments, handleGetReplies]);

	return (
		<div className={style.comments}>
			{loading ? (
				<Loading />
			) : error ? (
				<Error message={error} />
			) : (
				<>
					<h3> {allComments > 0 && allComments} Comments</h3>

					<div className={style.commentBoxWrap}>
						<CommentBox
							submitBtn={"Comment"}
							onGetComments={handleGetComments}
							onCreateComment={handleCreateComment}
						/>
					</div>

					<div className={style.content}>
						{items.length > 0 ? (
							<ul>{items}</ul>
						) : (
							<p>There are not comments.</p>
						)}
					</div>
				</>
			)}
		</div>
	);
};

Comments.propTypes = {
	postAuthorId: PropTypes.string,
	postId: PropTypes.string,
};

export default Comments;