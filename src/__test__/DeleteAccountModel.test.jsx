import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DeleteAccountModel from "../components/DeleteAccountModel";

import { AppProvider } from "../contexts/AppContext";

import handleFetch from "../utils/handleFetch";

vi.mock("../components/Error.jsx", () => ({
	default: () => <div>Error component</div>,
}));
vi.mock("../utils/handleFetch");

describe("DeleteAccountModel component", () => {
	it("should handle close model if the blur bgc element is clicked.", async () => {
		const user = userEvent.setup();
		const mockHandleCloseModel = vi.fn();

		render(
			<AppProvider>
				<DeleteAccountModel handleCloseModel={mockHandleCloseModel} />
			</AppProvider>
		);
		const element = screen.getByTestId("blurBgc");

		await user.click(element);

		expect(mockHandleCloseModel).toBeCalledTimes(1);
	});
	it("should handle delete user if the fetched result is successful after clicking the delete button.", async () => {
		const user = userEvent.setup();

		const mockResult = {
			success: true,
		};
		handleFetch.mockReturnValueOnce(mockResult);

		const mockSetToken = vi.fn();
		const mockHandleCloseSetting = vi.fn();
		const mockHandleCloseModel = vi.fn();

		render(
			<AppProvider setToken={mockSetToken}>
				<DeleteAccountModel
					handleCloseSettings={mockHandleCloseSetting}
					handleCloseModel={mockHandleCloseModel}
				/>
			</AppProvider>
		);

		const element = screen.getByRole("button", { name: "Delete" });

		await user.click(element);

		expect(handleFetch).toBeCalledTimes(1);
		expect(mockSetToken).toBeCalledTimes(1);
		expect(mockHandleCloseSetting).toBeCalledTimes(1);
		expect(mockHandleCloseModel).toBeCalledTimes(1);
	});
	it("should render the Error component if the fetched result fails after clicking the delete button.", async () => {
		const user = userEvent.setup();

		const mockResult = {
			success: false,
			message: "error",
		};
		handleFetch.mockReturnValueOnce(mockResult);

		render(
			<AppProvider>
				<DeleteAccountModel />
			</AppProvider>
		);

		const deleteBtn = screen.getByRole("button", { name: "Delete" });

		await user.click(deleteBtn);

		const element = screen.getByText("Error component");

		expect(handleFetch).toBeCalledTimes(1);
		expect(element).toBeInTheDocument();
	});
	it("should render the Error component if an error is captured while handling delete.", async () => {
		const user = userEvent.setup();
		const mockErrorMessage = "Fetch error";

		handleFetch.mockImplementationOnce(() => {
			throw new Error(mockErrorMessage);
		});

		render(
			<AppProvider>
				<DeleteAccountModel />
			</AppProvider>
		);

		const deleteBtn = screen.getByRole("button", { name: "Delete" });

		await user.click(deleteBtn);

		const element = screen.getByText("Error component");

		expect(handleFetch).toBeCalledTimes(1);
		expect(element).toBeInTheDocument();
	});
});
