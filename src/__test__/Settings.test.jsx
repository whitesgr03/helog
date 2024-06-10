import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Settings from "../components/Settings";

vi.mock("../components/ChangeNameModel.jsx", () => ({
	default: () => <div>ChangeNameModel component</div>,
}));

vi.mock("../components/DeleteAccountModel.jsx", () => ({
	default: () => <div>DeleteAccountModel component</div>,
}));

describe("Settings component", () => {
	it("should render the user name, email and avatar, if the user prop is true", () => {
		const mockUser = {
			name: "example",
			email: "example@gmail.com",
		};

		render(<Settings user={mockUser} />);

		const avatar = screen.getByText(mockUser.name.charAt(0).toUpperCase());
		const name = screen.getByText(mockUser.name);
		const email = screen.getByText(mockUser.email);

		expect(avatar).toBeInTheDocument();
		expect(name).toBeInTheDocument();
		expect(email).toBeInTheDocument();
	});
	it("should handle close Settings component, if the blur bgc element is clicked", async () => {
		const user = userEvent.setup();
		const mockHandleCloseSettings = vi.fn();

		render(<Settings handleCloseSettings={mockHandleCloseSettings} />);

		const element = screen.getByTestId("blurBgc");

		await user.click(element);

		expect(mockHandleCloseSettings).toBeCalledTimes(1);
	});
	it("should handle active mode, if the mode button is clicked", async () => {
		const user = userEvent.setup();
		const mockUser = {
			_id: 1,
			name: "example",
			email: "example@gmail.com",
		};

		render(<Settings user={mockUser} />);

		const changeNameBtn = screen.getByRole("button", {
			name: "Change name",
		});
		const deleteAccountBtn = screen.getByRole("button", {
			name: "Delete account",
		});

		await user.click(changeNameBtn);

		const changeNameModelComponent = screen.getByText(
			"ChangeNameModel component"
		);

		expect(changeNameModelComponent).toBeInTheDocument();

		await user.click(deleteAccountBtn);

		const deleteAccountModelComponent = screen.getByText(
			"DeleteAccountModel component"
		);

		expect(deleteAccountModelComponent).toBeInTheDocument();
	});
});
