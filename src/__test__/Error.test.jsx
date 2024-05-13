import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";

import Error from "../components/Error";

describe("Error component", () => {
	it("should render  title", () => {
		const mockError = {
			title: "404 Not Found",
			message: "The page you are looking for cannot be found.",
		};
		render(<Error error={mockError} />);

		const actual = screen.queryByRole("heading", {
			name: mockError.title,
		});

		expect(actual).not.equal(null);
	});
	it("should render message", () => {
		const mockError = {
			title: "404 Not Found",
			message: "The page you are looking for cannot be found.",
		};
		render(<Error error={mockError} />);

		const actual = screen.queryByText(mockError.message);

		expect(actual).not.equal(null);
	});
	it("should render default message", () => {
		const mockError = {
			title: "404 Not Found",
			message: "The page you are looking for cannot be found.",
		};
		const message = "Our apologies, there has been an error.";

		render(<Error error={mockError} />);

		const actual = screen.queryByText(message);

		expect(actual).not.equal(null);
	});
});
