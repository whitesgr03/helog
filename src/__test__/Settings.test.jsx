import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Settings from "../components/Settings";

describe("Settings component", () => {
	it("should render the user name from props", () => {
		const mockUserName = "Jeff";

		render(<Settings userName={mockUserName} />);

		const actual = screen.queryByText(mockUserName);

		expect(actual).not.toEqual(null);
	});
	it("should render the user email from props", () => {
		const mockUserEmail = "example@gmail.com";

		render(<Settings userName={mockUserEmail} />, {
			wrapper: BrowserRouter,
		});

		const actual = screen.queryByText(mockUserEmail);

		expect(actual).not.toEqual(null);
	});
});
