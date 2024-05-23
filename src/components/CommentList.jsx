import style from "../styles/CommentList.module.css";
import { format } from "date-fns";

import image from "../styles/utils/image.module.css";

import PropTypes from "prop-types";

const comments = [
	{
		id: 1,
		name: "DD",
		content:
			"I cannot get this to work for the life of me, I’m following the example perfectly though… Anyone have any ideas?",
		lastModified: new Date("2024/5/2"),
		createdAt: new Date("2024/5/1"),
		reply: [
			{
				id: 433,
				name: "JIOJIFD",
				content:
					"I’m following the example perfectly though… Anyone have any ideas?",
				lastModified: new Date("2024/5/5"),
				createdAt: new Date("2024/5/5"),
			},
			{
				id: 4453,
				name: "dmefoeps",
				content: "Anyone have any ideas?",
				lastModified: new Date("2024/5/7"),
				createdAt: new Date("2024/5/6"),
			},
		],
	},
	{
		id: 2,
		name: "JJJ",
		content: `I got the second method working on my site, but I also tried to get the nav container to follow the page by adding it it the code like this
$(‘html,body,#nav’)So I just added #nav to the selectors here. But it don’t work. The page still scrolls, but the nav container doesn’t follow. Any ideas?`,
		lastModified: new Date("2024/5/2"),
		createdAt: new Date("2024/5/1"),
		reply: [
			{
				id: 433,
				name: "JIOJIFD",
				content:
					"I’m following the example perfectly though… Anyone have any ideas?",
				lastModified: new Date("2024/5/5"),
				createdAt: new Date("2024/5/5"),
			},
			{
				id: 4453,
				name: "dmefoeps",
				content: "Anyone have any ideas?",
				lastModified: new Date("2024/5/7"),
				createdAt: new Date("2024/5/6"),
			},
		],
	},
	{
		id: 3,
		name: "JJJXX",
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
		reply: [],
	},
];

const Comment = ({ comment, postAuthor, user, children }) => (
	<div
		className={`${postAuthor === comment.name ? style.author : ""} ${
			user.name === comment.name ? style.user : ""
		} ${style.container}`}
	>
		<div className={style.info}>
			{postAuthor === comment.name && <strong>POST AUTHOR</strong>}
			<h3>{comment.name === user.name ? "Me" : comment.name}</h3>
			<span>{format(comment.createdAt, "MMMM d, y")}</span>
		</div>
		<p className={style.content}>{comment.content}</p>
		{children}
	</div>
);

const CommentList = ({ postAuthor }) => {
	const darkTheme = true;
	const user = {
		name: "JJJ",
	};
	const activeCommentIds = [1];

	const items = comments.map(comment => {
		const reply =
			comment.reply.length > 0 &&
			comment.reply.map(reply => (
				<li key={reply.id}>
					<Comment
						comment={reply}
						postAuthor={postAuthor}
						user={user}
					/>
				</li>
			));

		return (
			<li key={comment.id}>
				<Comment postAuthor={postAuthor} user={user} comment={comment}>
					<div className={style.buttonWrap}>
						{reply && (
							<button className={style.commentBtn}>
								<span
									className={`${image.icon} ${
										style.comment
									} ${
										activeCommentIds.includes(comment.id)
											? style.active
											: ""
									}`}
								></span>
								{comment.reply.length}
							</button>
						)}
						<button className={style.replyBtn}>Reply</button>
					</div>
				</Comment>
				{reply && activeCommentIds.includes(comment.id) && (
					<ul className={style.reply}>{reply}</ul>
				)}
			</li>
		);
	});

	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.commentList}`}>
			<h3>Comments</h3>
			<ul>{items}</ul>
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
