import style from "../styles/PostDetail.module.css";

import image from "../styles/utils/image.module.css";

import PropTypes from "prop-types";
import { format } from "date-fns";

import CommentList from "./CommentList";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const post = {
	id: "1",
	author: "DD",
	url,
	title: "Overview of the DevOps Interview Process: From Application to Selection-Part Terraform",
	content: `AI language models, such as ChatGPT and Claude, empower anyone to create software. These models can intelligently understand problems, create solutions, and explain the solutions. But natural language isn’t always the best way to communicate with AI. If you need to keep track of complex data and define how you interact with that data in specific ways, SudoLang can help.

If you think this is only going to help with AI code, think again. You can author any program in SudoLang and then transpile it to other languages, like JavaScript, Python, Rust, or C — so you can take advantage of these features no matter what kind of software you’re building.

What is SudoLang?
SudoLang is a programming language designed to collaborate with AI language models including ChatGPT, Bing Chat, Anthropic Claude, and Google Bard. It is designed to be easy to learn and use. It is also very expressive and powerful.

All advanced language models understand it without any special prompting. You do not need to paste the SudoLang specification before using SudoLang with your favorite AI.

Please read the SudoLang documentation for more information about the language.

Interfaces in SudoLang
Interface-oriented programming lets you structure your program and easily declare what you want the AI to keep track of and how you want to interact with it.

Interfaces are a powerful tool to encapsulate related state, constraints, commands, and functions. They organize the code in a clear, understandable, and reusable way.

The key features of interfaces in SudoLang include:

State: This represents the data associated with the interface.
Constraints: These are rules or requirements defined in natural language that the AI maintains automatically.
/Commands and methods: These are operations that can be performed on or by the interface.`,
	createdAt: new Date("2024/5/1"),
	lastModified: new Date("2024/5/20"),
};

const PostDetail = () => {
	const darkTheme = true;
	return (
		<div>
			<div
				className={`${darkTheme ? style.dark : ""} ${style.postDetail}`}
			>
				<h2 className={style.title}>{post.title}</h2>
				<div
					className={`${style.dateTime} ${
						post.createdAt.getTime() !== post.lastModified.getTime()
							? style.lastModified
							: style.createdAt
					}`}
				>
					<strong>
						Published in {format(post.createdAt, "MMMM d, y")}
					</strong>
					{post.createdAt.getTime() !==
						post.lastModified.getTime() && (
						<em>
							Edited in {format(post.lastModified, "MMMM d, y")}
						</em>
					)}

					<div
						className={`${darkTheme ? image.dark : ""} ${
							image.content
						}`}
					>
						<img src={post.url} alt={post.title} />
					</div>
				</div>
				<p>{post.content}</p>
			</div>
			<CommentList postAuthor={post.author} />
		</div>
	);
};

PostDetail.propTypes = {
	post: PropTypes.object,
};

export default PostDetail;
