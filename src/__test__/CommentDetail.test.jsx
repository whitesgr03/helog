import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { format } from "date-fns";

import CommentDetail from "../components/CommentDetail";

/* eslint-disable react/prop-types */
const Providers = ({ children, ...props }) => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Outlet context={{ ...props }} />}>
					<Route index element={children} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

describe("CommentDetail component", () => {
	it("should render comment data if the comment prop is true.", async () => {
		const mockComment = {
			_id: "1",
			author: {
				name: "example",
			},
			title: "This is title A",
			content: "This is content A",
			createdAt: new Date("2024/5/1"),
			lastModified: new Date("2024/5/2"),
		};

		render(
			<Providers>
				<CommentDetail comment={mockComment} />
			</Providers>
		);

		const title = screen.getByRole("heading", {
			name: mockComment.author.name,
			level: 3,
		});
		const content = screen.getByText(mockComment.content);
		const createdAt = screen.getByText(
			new RegExp(`${format(mockComment.createdAt, "MMMM d, y")}`, "i")
		);

		expect(title).toBeInTheDocument();
		expect(content).toBeInTheDocument();
		expect(createdAt).toBeInTheDocument();
	});
	it("should render reply button if the replyList prop is true.", async () => {
		const mockReplyList = [
			{
				_id: "1",
				author: {
					name: "example",
				},
				title: "This is title A",
				content: "This is content A",
				createdAt: new Date("2024/5/1"),
				lastModified: new Date("2024/5/2"),
			},
		];

		render(
			<Providers>
				<CommentDetail replyList={mockReplyList} />
			</Providers>
		);

		const element = screen.getByRole("button", { name: "Reply" });

		expect(element).toBeInTheDocument();
	});
	it("should render comment button and reply list if the replyList prop's length is greater then 0.", async () => {
		const mockReplyList = [{}, {}];

		render(
			<Providers>
				<CommentDetail replyList={mockReplyList}>
					<p>CommentDetail Children</p>
				</CommentDetail>
			</Providers>
		);

		const commentBtn = screen.getByRole("button", {
			name: mockReplyList.length,
		});

		const list = screen.getByRole("list");
		const element = screen.getByText("CommentDetail Children");

		expect(commentBtn).toBeInTheDocument();
		expect(list).toBeInTheDocument();
		expect(element).toBeInTheDocument();
	});
	it("should render strong element and 'author' class if the 'isPostAuthor' prop is true.", async () => {
		const mockIsPostAuthor = true;

		render(
			<Providers>
				<CommentDetail isPostAuthor={mockIsPostAuthor} />
			</Providers>
		);

		const element = screen.getByTestId("container");
		const strong = screen.getByRole("strong");

		expect(element).toHaveClass(/^_author_/);
		expect(strong).toBeInTheDocument();
	});
	it("should render 'user' class if the user in the outlet context is true and has the same name as the comment author.", async () => {
		const mockOutContext = {
			user: {
				name: "example",
			},
		};

		const mockComment = {
			_id: "1",
			author: {
				name: "example",
			},
			title: "This is title A",
			content: "This is content A",
			createdAt: new Date("2024/5/1"),
			lastModified: new Date("2024/5/2"),
		};

		render(
			<Providers {...mockOutContext}>
				<CommentDetail comment={mockComment} />
			</Providers>
		);

		const element = screen.getByTestId("container");

		expect(element).toHaveClass(/^_user_/);
	});
	it("should render 'active' class if the comment button is clicked to change 'showReplies' state to true.", async () => {
		const user = userEvent.setup();
		const mockReplyList = [{}, {}];

		render(
			<Providers>
				<CommentDetail replyList={mockReplyList}>
					<p>CommentDetail Children</p>
				</CommentDetail>
			</Providers>
		);

		const commentBtn = screen.getByRole("button", {
			name: mockReplyList.length,
		});

		await user.click(commentBtn);

		const element = screen.getByTestId("commentIcon");

		expect(element).toHaveClass(/^_active_/);
	});
});
