import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Posts from "../components/Posts";

describe("Post component", () => {
	it("should be rendered image", () => {
		render(<Posts />, { wrapper: BrowserRouter });

		const imageUrl = "#";
		const imageAlt = "Post Title";

		const actual = screen.getByAltText(imageAlt);

		expect(actual).toHaveAttribute("src", imageUrl);
		expect(actual).toHaveAttribute("alt", imageAlt);
	});
	it("should be rendered date time", () => {
		render(<Posts />, { wrapper: BrowserRouter });

		const dataTime = "Post Date Time";

		const actual = screen.getByText(dataTime);

		expect(actual).toHaveTextContent(dataTime);
	});
	it("should be rendered title", () => {
		render(<Posts />, { wrapper: BrowserRouter });

		const title = "Post Title";

		const actual = screen.getByRole("heading", { name: title });

		expect(actual).toHaveTextContent(title);
	});
	it("should be rendered content", () => {
		render(<Posts />, { wrapper: BrowserRouter });

		const content = "Post Content";

		const actual = screen.getByText(content);

		expect(actual).toHaveTextContent(content);
	});
});
