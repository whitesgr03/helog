import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import Header from "../components/Header";

vi.mock("../components/Dropdown.jsx", () => ({
	default: () => <div>Dropdown component</div>,
}));

describe("Header component", () => {
	it("should render link of write, if the user of isAdmin is true", () => {
		const mockUser = {
			isAdmin: true,
		};

		render(<Header user={mockUser} />, { wrapper: BrowserRouter });

		const element = screen.getByRole("link", { name: "Write" });

		expect(element).toBeInTheDocument();
	});
	it("should render the dark color theme, if the 'darkTheme' prop is true", () => {
		const mockDarkTheme = true;
		render(<Header darkTheme={mockDarkTheme} />, {
			wrapper: BrowserRouter,
		});

		const element = screen.getByRole("button", { name: /Dark/i });

		expect(element).toBeInTheDocument();
	});
	it("should change the color theme, if the color them button is clicked", async () => {
		const user = userEvent.setup();
		const mockDarkTheme = true;
		const mockHandleSwitchColorTheme = vi.fn();
		render(
			<Header
				darkTheme={mockDarkTheme}
				handleSwitchColorTheme={mockHandleSwitchColorTheme}
			/>,
			{ wrapper: BrowserRouter }
		);

		const element = screen.getByRole("button", { name: /Dark/i });

		await user.click(element);

		expect(mockHandleSwitchColorTheme).toBeCalledTimes(1);
	});
	it("should render Dropdown component and transparent bgc, if the account btn is clicked", async () => {
		const user = userEvent.setup();

		render(<Header />, { wrapper: BrowserRouter });

		const accountBtn = screen.getByRole("button", { name: "Account" });

		await user.click(accountBtn);

		const component = screen.getByText("Dropdown component");
		const element = screen.getByTestId("transparentBgc");

		expect(component).toBeInTheDocument();
		expect(element).toBeInTheDocument();
	});
	it("should close Dropdown component and transparent bgc, if the transparent bgc is clicked", async () => {
		const user = userEvent.setup();

		render(<Header />, { wrapper: BrowserRouter });

		const accountBtn = screen.getByRole("button", { name: "Account" });

		await user.click(accountBtn);

		let element = screen.getByTestId("transparentBgc");

		await user.click(element);

		const component = screen.queryByText("dropdown");
		element = screen.queryByTestId("transparentBgc");

		expect(component).not.toBeInTheDocument();
		expect(element).not.toBeInTheDocument();
	});
});

// 繼續從 header 往下驗證
