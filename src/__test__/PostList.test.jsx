import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";
import { format } from "date-fns";

import PostList from "../components/PostList";

describe("PostList component", () => {
	it("should be rendered correct data length", () => {
		const mockPosts = [
			{
				id: "1",
				url: "#",
				title: "This is title A",
				content: "This is content A",
				createdAt: new Date("2024/5/1"),
			},
			{
				id: "2",
				url: "#",
				title: "This is title B",
				content: "This is content B",
				createdAt: new Date("2024/5/1"),
			},
			{
				id: "3",
				url: "#",
				title: "This is title C",
				content: "This is content C",
				createdAt: new Date("2024/5/1"),
			},
		];

		render(<PostList posts={mockPosts} />);

		const actual = screen.getAllByRole("listitem");

		expect(actual.length).equal(3);
	});
	it("should be rendered image alt and url from props", () => {
		const mockPosts = [
			{
				id: "1",
				url: "#",
				title: "This is title",
				content: "This is content",
				createdAt: new Date("2024/5/1"),
			},
		];

		render(<PostList posts={mockPosts} />);

		const actual = screen.getByAltText(mockPosts[0].title);

		expect(actual).toHaveAttribute("src", mockPosts.url);
	});
	it("should be rendered createdAt from props", () => {
		const mockPosts = [
			{
				id: "1",
				url: "#",
				title: "This is title",
				content: "This is content",
				createdAt: new Date("2024/5/1"),
			},
		];
		render(<PostList posts={mockPosts} />);

		const actual = screen.queryByText(
			format(mockPosts[0].createdAt, "MMMM d, y")
		);

		expect(actual).not.equal(null);
	});
	it("should be rendered title from props", () => {
		const mockPosts = [
			{
				id: "1",
				url: "#",
				title: "This is title",
				content: "This is content",
				createdAt: new Date("2024/5/1"),
			},
		];
		render(<PostList posts={mockPosts} />);

		const actual = screen.queryByRole("heading", {
			name: mockPosts[0].title,
		});

		expect(actual).not.equal(null);
	});
	it("should be rendered content from props", () => {
		const mockPosts = [
			{
				id: "1",
				url: "#",
				title: "This is title",
				content: "This is content",
				createdAt: new Date("2024/5/1"),
			},
		];
		render(<PostList posts={mockPosts} />);

		const actual = screen.queryByText(mockPosts[0].content);

		expect(actual).not.equal(null);
	});
});
