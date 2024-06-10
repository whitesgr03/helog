import { vi } from "vitest";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import Register from "../components/Register";

import handleFetch from "../utils/handleFetch";

vi.mock("../components/Error.jsx", () => ({
	default: () => <div>Error component</div>,
}));

vi.mock("../utils/handleFetch");

/* eslint-disable react/prop-types */
const Providers = ({ children, ...props }) => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Outlet context={{ ...props }} />}>
					<Route index element={children} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

describe("Register component", () => {
	it("should render errors for each input if 'handleValidFields' fails on submission.", async () => {
		const user = userEvent.setup();
		const mockOutContext = {
			setToken: vi.fn(),
		};

		render(
			<Providers {...mockOutContext}>
				<Register />
			</Providers>
		);

		const submitBtn = screen.getByRole("button", { name: "Register" });

		let defaultErrorMessages = screen.getAllByText("Message placeholder");

		expect(defaultErrorMessages.length).toEqual(4);

		await user.click(submitBtn);

		defaultErrorMessages = screen.queryAllByText("Message placeholder");

		expect(defaultErrorMessages.length).toEqual(0);
	});
	it("should continue valid fields when entering again after submission failed.", async () => {
		const user = userEvent.setup();
		const mockOutContext = {
			setToken: vi.fn(),
		};

		render(
			<Providers {...mockOutContext}>
				<Register />
			</Providers>
		);

		const submitBtn = screen.getByRole("button", { name: "Register" });
		const nameInput = screen.getByLabelText("Name");
		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Password");
		const confirmPasswordInput = screen.getByLabelText("Confirm Password");

		await user.click(submitBtn);

		let defaultErrorMessages = screen.queryAllByText("Message placeholder");

		expect(defaultErrorMessages.length).toEqual(0);

		await user.type(nameInput, "Example");
		await user.type(emailInput, "example@gmail.com");
		await user.type(passwordInput, "1!Qwerty");
		await user.type(confirmPasswordInput, "1!Qwerty");

		defaultErrorMessages = await screen.findAllByText(
			"Message placeholder"
		);

		expect(defaultErrorMessages.length).toEqual(4);
	});
	it("should set token if the 'handleRegister' fetch result is successfully", async () => {
		const user = userEvent.setup();
		const mockOutletContext = {
			setToken: vi.fn(),
		};

		const mockResult = {
			success: true,
			data: {
				token: "exampleToken",
			},
		};

		handleFetch.mockReturnValueOnce(mockResult);

		render(
			<Providers {...mockOutletContext}>
				<Register />
			</Providers>
		);

		const nameInput = screen.getByLabelText("Name");
		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Password");
		const confirmPasswordInput = screen.getByLabelText("Confirm Password");

		const submitBtn = screen.getByRole("button", { name: "Register" });

		await user.type(nameInput, "Example");
		await user.type(emailInput, "example@gmail.com");
		await user.type(passwordInput, "1!Qwerty");
		await user.type(confirmPasswordInput, "1!Qwerty");

		await user.click(submitBtn);

		expect(handleFetch).toBeCalledTimes(1);
		expect(mockOutletContext.setToken).toBeCalledTimes(1);
	});
	it("should render errors for each input if 'handleRegister' fetch result is fails.", async () => {
		const user = userEvent.setup();
		const mockOutletContext = {
			setToken: vi.fn(),
		};

		const mockResult = {
			success: false,
			errors: [
				{
					field: "name",
					message: "error",
				},
				{
					field: "email",
					message: "error",
				},
				{
					field: "password",
					message: "error",
				},
				{
					field: "confirmPassword",
					message: "error",
				},
			],
		};

		handleFetch.mockReturnValueOnce(mockResult);

		render(
			<Providers {...mockOutletContext}>
				<Register />
			</Providers>
		);

		const nameInput = screen.getByLabelText("Name");
		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Password");
		const confirmPasswordInput = screen.getByLabelText("Confirm Password");

		const submitBtn = screen.getByRole("button", { name: "Register" });

		await user.type(nameInput, "Example");
		await user.type(emailInput, "example@gmail.com");
		await user.type(passwordInput, "1!Qwerty");
		await user.type(confirmPasswordInput, "1!Qwerty");

		await user.click(submitBtn);

		const defaultErrorMessages = screen.queryAllByText(
			"Message placeholder"
		);

		expect(defaultErrorMessages.length).toEqual(0);
		expect(handleFetch).toBeCalledTimes(1);
	});
	it("should render the Error component if the 'handleRegister' fetch result is fails.", async () => {
		const user = userEvent.setup();
		const mockOutletContext = {
			setToken: vi.fn(),
		};

		const mockResult = {
			success: false,
			message: "error",
		};

		handleFetch.mockReturnValueOnce(mockResult);

		render(
			<Providers {...mockOutletContext}>
				<Register />
			</Providers>
		);

		const nameInput = screen.getByLabelText("Name");
		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Password");
		const confirmPasswordInput = screen.getByLabelText("Confirm Password");

		const submitBtn = screen.getByRole("button", { name: "Register" });

		await user.type(nameInput, "Example");
		await user.type(emailInput, "example@gmail.com");
		await user.type(passwordInput, "1!Qwerty");
		await user.type(confirmPasswordInput, "1!Qwerty");

		await user.click(submitBtn);

		const element = screen.getByText("Error component");

		expect(handleFetch).toBeCalledTimes(1);
		expect(element).toBeInTheDocument();
	});
	it("should render the Error component if an error is captured while performing 'handleRegister'.", async () => {
		const user = userEvent.setup();
		const mockOutletContext = {
			setToken: vi.fn(),
		};

		handleFetch.mockImplementationOnce(() => {
			throw new Error("Fetch Error");
		});
		render(
			<Providers {...mockOutletContext}>
				<Register />
			</Providers>
		);

		const nameInput = screen.getByLabelText("Name");
		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Password");
		const confirmPasswordInput = screen.getByLabelText("Confirm Password");

		const submitBtn = screen.getByRole("button", { name: "Register" });

		await user.type(nameInput, "Example");
		await user.type(emailInput, "example@gmail.com");
		await user.type(passwordInput, "1!Qwerty");
		await user.type(confirmPasswordInput, "1!Qwerty");

		await user.click(submitBtn);

		const element = screen.getByText("Error component");

		expect(handleFetch).toBeCalledTimes(1);
		expect(element).toBeInTheDocument();
	});
});
