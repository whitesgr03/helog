import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
// import { format } from "date-fns";
// import { BrowserRouter } from "react-router-dom";

import PostDetail from "../components/PostDetail";

describe("PostDetail component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<PostDetail />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});

// it("should render title, if post is true", () => {
// 	const mockPosts = [
// 		{
// 			id: "1",
// 			url: "#",
// 			title: "This is title",
// 			content: "This is content",
// 			createdAt: new Date("2024/5/1"),
// 			lastModified: new Date("2024/5/1"),
// 		},
// 	];
// 	render(<PostDetail />);

// 	const actual = screen.queryByRole("heading", {
// 		level: 2,
// 		name: mockPosts[0].title,
// 	});

// 	expect(actual).not.equal(null);
// });
// it("should render creation date, if post is true", () => {
// 	const mockPosts = [
// 		{
// 			id: "1",
// 			url: "#",
// 			title: "This is title",
// 			content: "This is content",
// 			createdAt: new Date("2024/5/1"),
// 			lastModified: new Date("2024/5/1"),
// 		},
// 	];
// 	render(<PostDetail />);

// 	const actual = screen.queryByText(
// 		format(mockPosts[0].createdAt, "MMMM d, y")
// 	);

// 	expect(actual).not.equal(null);
// });
// it("should render last modified date, if post is true", () => {
// 	const mockPosts = [
// 		{
// 			id: "1",
// 			url: "#",
// 			title: "This is title",
// 			content: "This is content",
// 			createdAt: new Date("2024/5/1"),
// 			lastModified: new Date("2024/5/2"),
// 		},
// 	];
// 	render(<PostDetail />);

// 	const actual = screen.queryByText(
// 		format(mockPosts[0].createdAt, "MMMM d, y")
// 	);

// 	expect(actual).not.equal(null);
// });
// it("should render image alt and url, if post is true", () => {
// 	const mockPosts = [
// 		{
// 			id: "1",
// 			url: "#",
// 			title: "This is title",
// 			content: "This is content",
// 			createdAt: new Date("2024/5/1"),
// 			lastModified: new Date("2024/5/1"),
// 		},
// 	];

// 	render(<PostDetail />);

// 	const actual = screen.getByAltText(mockPosts[0].title);

// 	expect(actual).toHaveAttribute("src", mockPosts.url);
// });
// it("should render content, if post is true", () => {
// 	const mockPosts = [
// 		{
// 			id: "1",
// 			url: "#",
// 			title: "This is title",
// 			content: "This is content",
// 			createdAt: new Date("2024/5/1"),
// 			lastModified: new Date("2024/5/1"),
// 		},
// 	];
// 	render(<PostDetail />);

// 	const actual = screen.queryByText(mockPosts[0].content);

// 	expect(actual).not.equal(null);
// });
