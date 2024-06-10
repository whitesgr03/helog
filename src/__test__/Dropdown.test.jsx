import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import Dropdown from "../components/Dropdown";

import { AppProvider } from "../contexts/AppContext";

vi.mock("../components/Settings.jsx", () => ({
	default: () => <div>Settings component</div>,
}));

describe("Dropdown component", () => {
	it("should render the user name, settings button and logout button if the name of user received from prop.", () => {
		const mockUser = {
			name: "example",
		};

		render(
			<AppProvider>
				<Dropdown user={mockUser} />
			</AppProvider>,
			{ wrapper: BrowserRouter }
		);

		const element = screen.getByText(mockUser.name);
		const settingsBtn = screen.getByRole("button", { name: "Settings" });
		const logoutBtn = screen.getByRole("button", { name: "Logout" });

		expect(element).toBeInTheDocument();
		expect(settingsBtn).toBeInTheDocument();
		expect(logoutBtn).toBeInTheDocument();
	});
	it("should render the login button if the user received from prop is false.", () => {
		const mockUser = null;

		render(
			<AppProvider>
				<Dropdown user={mockUser} />
			</AppProvider>,
			{ wrapper: BrowserRouter }
		);

		const loginBtn = screen.getByRole("link", { name: "Login" });

		expect(loginBtn).toBeInTheDocument();
	});
	it("should render the dark color theme, if the 'darkTheme' prop is true", () => {
		const mockDarkTheme = true;
		render(
			<AppProvider>
				<Dropdown darkTheme={mockDarkTheme} />
			</AppProvider>,
			{ wrapper: BrowserRouter }
		);

		const element = screen.getByRole("button", { name: "Dark mode" });

		expect(element).toBeInTheDocument();
	});
	it("should render Settings component, if the settings button is clicked", async () => {
		const user = userEvent.setup();
		const mockUser = {
			name: "example",
		};

		render(
			<AppProvider>
				<Dropdown user={mockUser} />
			</AppProvider>,
			{ wrapper: BrowserRouter }
		);

		const settingBtn = screen.getByRole("button", { name: "Settings" });

		await user.click(settingBtn);

		const element = screen.getByText("Settings component");

		expect(element).toBeInTheDocument();
	});
	it("should switch color theme, if the color theme button is clicked", async () => {
		const user = userEvent.setup();
		const mockDarkTheme = true;
		const mockHandleSwitchColorTheme = vi.fn();
		render(
			<AppProvider>
				<Dropdown
					darkTheme={mockDarkTheme}
					handleSwitchColorTheme={mockHandleSwitchColorTheme}
				/>
			</AppProvider>,
			{ wrapper: BrowserRouter }
		);

		const element = screen.getByRole("button", { name: "Dark mode" });

		await user.click(element);

		expect(mockHandleSwitchColorTheme).toBeCalledTimes(1);
	});
	it("should close Dropdown component, if the login link is clicked", async () => {
		const user = userEvent.setup();
		const mockUser = null;
		const mockHandleCloseDropdown = vi.fn();
		render(
			<AppProvider>
				<Dropdown
					user={mockUser}
					handleCloseDropdown={mockHandleCloseDropdown}
				/>
			</AppProvider>,
			{ wrapper: BrowserRouter }
		);

		const element = screen.getByRole("link", { name: "Login" });

		await user.click(element);

		expect(mockHandleCloseDropdown).toBeCalledTimes(1);
	});
	it("should logout, if the logout button is clicked", async () => {
		const user = userEvent.setup();
		const mockUser = {
			name: "example",
		};
		const mockHandleCloseDropdown = vi.fn();
		const mockSetToken = vi.fn();
		render(
			<AppProvider setToken={mockSetToken}>
				<Dropdown
					user={mockUser}
					handleCloseDropdown={mockHandleCloseDropdown}
				/>
			</AppProvider>,
			{ wrapper: BrowserRouter }
		);

		const element = screen.getByRole("button", { name: "Logout" });

		await user.click(element);

		expect(mockSetToken).toBeCalledTimes(1);
		expect(mockHandleCloseDropdown).toBeCalledTimes(1);
	});
});
