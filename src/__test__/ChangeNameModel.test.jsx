import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChangeNameModel from "../components/ChangeNameModel";

import { AppProvider } from "../contexts/AppContext";

import handleFetch from "../utils/handleFetch";

vi.mock("../components/Error.jsx", () => ({
	default: () => <div>Error component</div>,
}));

vi.mock("../utils/handleFetch");

describe("ChangeNameModel component", () => {
	it("should handle close model, if the blur bgc element is clicked", async () => {
		const user = userEvent.setup();
		const mockHandleCloseModel = vi.fn();

		render(
			<AppProvider>
				<ChangeNameModel handleCloseModel={mockHandleCloseModel} />
			</AppProvider>
		);
		const element = screen.getByTestId("blurBgc");

		await user.click(element);

		expect(mockHandleCloseModel).toBeCalledTimes(1);
	});
	it("should render error for input if submission failed.", async () => {
		const user = userEvent.setup();

		render(
			<AppProvider>
				<ChangeNameModel />
			</AppProvider>
		);

		const submitBtn = screen.getByRole("button", { name: "Save" });

		let defaultErrorMessage = screen.getByText("Message placeholder");

		expect(defaultErrorMessage).toBeInTheDocument();

		await user.click(submitBtn);

		defaultErrorMessage = screen.queryByText("Message placeholder");

		expect(defaultErrorMessage).toEqual(null);
	});
	it("should continue valid fields when entering again after submission failed.", async () => {
		const user = userEvent.setup();

		render(
			<AppProvider>
				<ChangeNameModel />
			</AppProvider>
		);

		const changeNameInput = screen.getByLabelText("Change Name");
		const submitBtn = screen.getByRole("button", { name: "Save" });

		await user.click(submitBtn);

		await user.type(changeNameInput, "example");

		const defaultErrorMessage = await screen.findByText(
			"Message placeholder"
		);
		expect(defaultErrorMessage).toBeInTheDocument();
		expect(1).toEqual(1);
	});
	it("should handle set new user info if the 'handleUpdate' fetch result is successfully", async () => {
		const user = userEvent.setup();

		const mockResult = {
			success: true,
		};

		const mockHandleCloseModel = vi.fn();

		const mockHandleGetUser = vi.fn();

		handleFetch.mockReturnValueOnce(mockResult);

		render(
			<AppProvider handleGetUser={mockHandleGetUser}>
				<ChangeNameModel handleCloseModel={mockHandleCloseModel} />
			</AppProvider>
		);

		const changeNameInput = screen.getByLabelText("Change Name");
		const submitBtn = screen.getByRole("button", { name: "Save" });

		await user.type(changeNameInput, "example");

		await user.click(submitBtn);
		expect(handleFetch).toBeCalledTimes(1);
		expect(mockHandleCloseModel).toBeCalledTimes(1);
		expect(mockHandleGetUser).toBeCalledTimes(1);
	});
	it("should render error for input if 'handleUpdate' fetch result is fails.", async () => {
		const user = userEvent.setup();

		const mockResult = {
			success: false,
			errors: [
				{
					field: "name",
					message: "error",
				},
			],
		};

		handleFetch.mockReturnValueOnce(mockResult);

		render(
			<AppProvider>
				<ChangeNameModel />
			</AppProvider>
		);

		const changeNameInput = screen.getByLabelText("Change Name");
		const submitBtn = screen.getByRole("button", { name: "Save" });

		await user.type(changeNameInput, "example");

		await user.click(submitBtn);

		const defaultErrorMessage = screen.queryByText("Message placeholder");

		expect(handleFetch).toBeCalledTimes(1);
		expect(defaultErrorMessage).toEqual(null);
	});
	it("should render the Error component if the 'handleUpdate' fetch result is fails.", async () => {
		const user = userEvent.setup();

		const mockResult = {
			success: false,
			message: "error",
		};

		handleFetch.mockReturnValueOnce(mockResult);

		render(
			<AppProvider>
				<ChangeNameModel />
			</AppProvider>
		);

		const changeNameInput = screen.getByLabelText("Change Name");
		const submitBtn = screen.getByRole("button", { name: "Save" });

		await user.type(changeNameInput, "e");

		await user.click(submitBtn);

		const element = screen.getByText("Error component");

		expect(handleFetch).toBeCalledTimes(1);
		expect(element).toBeInTheDocument();
	});
	it("should render the Error component if an error is captured while performing 'handleUpdate'.", async () => {
		const user = userEvent.setup();

		handleFetch.mockImplementationOnce(() => {
			throw new Error("Fetch Error");
		});

		render(
			<AppProvider>
				<ChangeNameModel />
			</AppProvider>
		);

		const changeNameInput = screen.getByLabelText("Change Name");
		const submitBtn = screen.getByRole("button", { name: "Save" });

		await user.type(changeNameInput, "example");

		await user.click(submitBtn);

		const element = screen.getByText("Error component");

		expect(handleFetch).toBeCalledTimes(1);
		expect(element).toBeInTheDocument();
	});
});
