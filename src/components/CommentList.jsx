import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";

import style from "../styles/CommentList.module.css";
import image from "../styles/utils/image.module.css";

const comments = [
	{
		id: "1",
		author: "DD",
		content:
			"I cannot get this to work for the life of me, I’m following the example perfectly though… Anyone have any ideas?",
		lastModified: new Date("2024/5/2"),
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "2",
		author: "JJJ",
		content: `I got the second method working on my site, but I also tried to get the nav container to follow the page by adding it it the code like this
$(‘html,body,#nav’)So I just added #nav to the selectors here. But it don’t work. The page still scrolls, but the nav container doesn’t follow. Any ideas?`,
		lastModified: new Date("2024/5/2"),
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "3",
		author: "JJJXX",
		content: `Hi Chris and co.

When I use this method #2, my Firefox Developer Toolbar shows a js error as follows:

Expected identifier or string value in attribute selector but found “#”.

What am I missing..?

To help, I am using jquery-1.4.2.min.js, and I’m linking to h2’s with id’s, like so:

Go to 01
This is Link 01

Thanks in advance.`,
		lastModified: new Date("2024/5/2"),
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "4",
		author: "JIOJIFD",
		content:
			"I’m following the example perfectly though… Anyone have any ideas?",
		lastModified: new Date("2024/5/5"),
		createdAt: new Date("2024/5/5"),
		reply: "2",
	},
	{
		id: "5",
		author: "dmefoeps",
		content: "Anyone have any ideas?",
		lastModified: new Date("2024/5/7"),
		createdAt: new Date("2024/5/6"),
		reply: "1",
	},
	{
		id: "6",
		author: "TT",
		content:
			"I’m following the example perfectly though… Anyone have any ideas?",
		lastModified: new Date("2024/5/5"),
		createdAt: new Date("2024/5/5"),
		reply: "2",
	},
	{
		id: "7",
		author: "QQ",
		content: "Anyone have any ideas?",
		lastModified: new Date("2024/5/7"),
		createdAt: new Date("2024/5/6"),
		reply: "2",
	},
];

const Comment = ({ comment, postAuthor, user, children }) => (
	<div
		className={`${postAuthor === comment.author ? style.author : ""} ${
			user.author === comment.author ? style.user : ""
		} ${style.container}`}
	>
		<div className={style.info}>
			{postAuthor === comment.author && <strong>POST AUTHOR</strong>}
			<h3>{comment.author === user.author ? "Me" : comment.author}</h3>
			<span>{format(comment.createdAt, "MMMM d, y")}</span>
		</div>
		<p className={style.content}>{comment.content}</p>
		{children}
	</div>
);

const CommentList = ({ postAuthor }) => {
	const [commentIds, setCommentIds] = useState({});

	const { user } = useOutletContext();

	const handleShowComment = e => {
		const { id } = e.target.dataset;
		const { [id]: existsId, ...rest } = commentIds;
		id && setCommentIds(existsId ? { ...rest } : { ...rest, [id]: id });
	};

	const parentComments = comments.filter(comment => !comment?.reply);
	const replyComments = comments.filter(comment => comment.reply);

	const items = parentComments.map(comment => {
		const replyList = [...replyComments].filter(
			rComment =>
				rComment.reply === comment.id &&
				replyComments.splice(
					replyComments.findIndex(reply => reply.id === rComment.id),
					1
				)
		);

		return (
			<li key={comment.id}>
				<Comment postAuthor={postAuthor} user={user} comment={comment}>
					<div className={style.buttonWrap}>
						{replyList.length > 0 && (
							<button
								className={style.commentBtn}
								data-id={comment.id}
							>
								<span
									className={`${image.icon} ${
										style.comment
									} ${
										commentIds[comment.id]
											? style.active
											: ""
									}`}
								></span>
								{replyList.length}
							</button>
						)}
						<button className={style.replyBtn}>Reply</button>
					</div>
				</Comment>
				{replyList.length > 0 && (
					<ul
						className={`${style.reply} ${
							commentIds[comment.id] ? style.active : ""
						}`}
					>
						{replyList.map(reply => (
							<li key={reply.id}>
								<Comment
									comment={reply}
									postAuthor={postAuthor}
									user={user}
								/>
							</li>
						))}
					</ul>
				)}
			</li>
		);
	});

	return (
		<div className={style.commentList}>
			<h3>Comments</h3>
			<ul onClick={handleShowComment}>{items}</ul>
		</div>
	);
};

CommentList.propTypes = {
	postAuthor: PropTypes.string,
};

Comment.propTypes = {
	comment: PropTypes.object,
	postAuthor: PropTypes.string,
	user: PropTypes.object,
	children: PropTypes.node,
};

export default CommentList;
