import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Dropdown from "../components/Dropdown";

describe("Dropdown component", () => {
	it("should render the user name, if the 'isLogin' is true", () => {
		const mockUserName = "Jeff";
		const mockIsLogin = true;

		render(<Dropdown isLogin={mockIsLogin} userName={mockUserName} />, {
			wrapper: BrowserRouter,
		});

		const actual = screen.queryByText("Jeff");

		expect(actual).not.toEqual(null);
	});
	it("should render the settings button, if the 'isLogin' is true", () => {
		const mockIsLogin = true;

		render(<Dropdown isLogin={mockIsLogin} />, {
			wrapper: BrowserRouter,
		});

		const actual = screen.queryByRole("button", { name: "Settings" });

		expect(actual).not.toEqual(null);
	});
	it("should render the logout button, if the 'isLogin' is true", () => {
		const mockIsLogin = true;

		render(<Dropdown isLogin={mockIsLogin} />, {
			wrapper: BrowserRouter,
		});

		const actual = screen.queryByRole("button", { name: "Logout" });

		expect(actual).not.toEqual(null);
	});
});
