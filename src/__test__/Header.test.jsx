import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Header from "../components/Header";

describe("Header component", () => {
	it("should render the link, if the 'isAdmin' is true", () => {
		const mockIsAdmin = true;
		const linkText = "Write";

		render(<Header isAdmin={mockIsAdmin} />, {
			wrapper: BrowserRouter,
		});

		const actual = screen.queryByRole("link", { name: linkText });

		expect(actual).not.toEqual(null);
	});
});
