import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
// import { BrowserRouter } from "react-router-dom";

import PostDetail from "../components/PostDetail";

describe("PostDetail component", () => {
	it("should render date time from props", () => {
		const mockPost = {
			id: "1",
			url: "#",
			title: "This is title",
			content: "This is content",
			createdAt: new Date("2024/5/1"),
		};

		render(<PostDetail post={mockPost} />);

		const actual = screen.queryByText(
			format(mockPost.createdAt, "MMMM d, y")
		);

		expect(actual).not.equal(null);
	});
	it("should render title from props", () => {
		const mockPost = {
			id: "1",
			url: "#",
			title: "This is title",
			content: "This is content",
			createdAt: new Date("2024/5/1"),
		};

		render(<PostDetail post={mockPost} />);

		const actual = screen.getByRole("heading", { name: mockPost.title });

		expect(actual).not.equal(null);
	});
	it("should render image alt and url from props", () => {
		const mockPost = {
			id: "1",
			url: "#",
			title: "This is title",
			content: "This is content",
			createdAt: new Date("2024/5/1"),
		};

		render(<PostDetail post={mockPost} />);

		const actual = screen.getByAltText(mockPost.title);

		expect(actual).toHaveAttribute("src", mockPost.url);
	});
	it("should render content from props", () => {
		const mockPost = {
			id: "1",
			url: "#",
			title: "This is title",
			content: "This is content",
			createdAt: new Date("2024/5/1"),
		};

		render(<PostDetail post={mockPost} />);

		const actual = screen.getByText(mockPost.content);

		expect(actual).not.equal(null);
	});
});
