import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Error from "../components/Error";

describe("Error component", () => {
	it("should be rendered title", () => {
		render(<Error />, { wrapper: BrowserRouter });

		const title = "404 Not Found";

		const actual = screen.getByRole("heading", { name: title });

		expect(actual).toHaveTextContent(title);
	});
	it("should be rendered message", () => {
		render(<Error />, { wrapper: BrowserRouter });

		const message = "Our apologies, there has been an error.";

		const actual = screen.getByText(message);

		expect(actual).toHaveTextContent(message);
	});
	it("should be rendered message", () => {
		render(<Error />, { wrapper: BrowserRouter });

		const message = "The page you are looking for cannot be found.";

		const actual = screen.getByText(message);

		expect(actual).toHaveTextContent(message);
	});
});
