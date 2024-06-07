import { useState } from "react";
import PropTypes from "prop-types";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";

import style from "../styles/CommentDetail.module.css";
import image from "../styles/utils/image.module.css";

const CommentDetail = ({ comment, replyList, isPostAuthor, children }) => {
	const [showReplies, setShowReplies] = useState(false);
	const { user } = useOutletContext();

	const handleShowReplies = () => setShowReplies(!showReplies);

	return (
		<li className={style.comment}>
			<div
				className={`${isPostAuthor ? style.author : ""} ${
					user?.name === comment?.author.name ? style.user : ""
				} ${style.container}`}
				data-testid="container"
			>
				<div className={style.info}>
					{isPostAuthor && <strong>POST AUTHOR</strong>}
					<h3>{comment?.author.name}</h3>
					{comment?.createdAt && (
						<span>{format(comment.createdAt, "MMMM d, y")}</span>
					)}
				</div>
				<p className={style.content}>{comment?.content}</p>

				{replyList && (
					<div className={style.buttonWrap}>
						{replyList.length > 0 && (
							<button
								className={style.commentBtn}
								onClick={handleShowReplies}
							>
								<span
									className={`${image.icon} ${
										style.replies
									} ${showReplies ? style.active : ""}`}
									data-testid="commentIcon"
								/>
								{replyList.length}
							</button>
						)}
						<button className={style.replyBtn}>Reply</button>
					</div>
				)}
			</div>
			{replyList?.length > 0 && (
				<ul
					className={`${style.reply} ${
						showReplies ? style.active : ""
					} `}
				>
					{children}
				</ul>
			)}
		</li>
	);
};

CommentDetail.propTypes = {
	replyList: PropTypes.array,
	comment: PropTypes.object,
	isPostAuthor: PropTypes.bool,
	children: PropTypes.node,
};

export default CommentDetail;
