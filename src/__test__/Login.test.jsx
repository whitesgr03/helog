import { vi } from "vitest";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import Login from "../components/Login";

import handleFetch from "../utils/handleFetch";

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

describe("Login component", () => {
	it("should render error messages if the validation field fails when submitting.", async () => {
		const user = userEvent.setup();
		const mockOutContext = {
			setToken: vi.fn(),
		};

		render(
			<Providers {...mockOutContext}>
				<Login />
			</Providers>
		);

		const submitBtn = screen.getByRole("button", { name: "Login" });

		await user.click(submitBtn);

		const defaultErrorMessages = screen.queryAllByText(
			"Error message placeholder"
		);

		expect(defaultErrorMessages.length).toEqual(0);
	});
	it("should login successfully if the validation field is successful when submitting.", async () => {
		const user = userEvent.setup();
		const mockOutletContext = {
			setToken: vi.fn(),
		};

		handleFetch.mockReturnValueOnce({ data: [] });

		render(
			<Providers {...mockOutletContext}>
				<Login />
			</Providers>
		);

		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Password");
		const submitBtn = screen.getByRole("button", { name: "Login" });

		await user.type(emailInput, "example@gmail.com");
		await user.type(passwordInput, "1!Qwerty");

		await user.click(submitBtn);

		expect(handleFetch).toBeCalledTimes(1);
		expect(mockOutletContext.setToken).toBeCalledTimes(1);
	});
	it("should continue validating fields when entering again after a failed submission validation.", async () => {
		const user = userEvent.setup();
		const mockOutContext = {
			setToken: vi.fn(),
		};

		render(
			<Providers {...mockOutContext}>
				<Login />
			</Providers>
		);

		const submitBtn = screen.getByRole("button", { name: "Login" });
		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Password");

		await user.click(submitBtn);

		let defaultErrorMessages = screen.queryAllByText(
			"Error message placeholder"
		);

		expect(defaultErrorMessages.length).toEqual(0);

		await user.type(emailInput, "example@gmail.com");
		await user.type(passwordInput, "1!Qwerty");

		defaultErrorMessages = await screen.findAllByText(
			"Error message placeholder"
		);

		expect(defaultErrorMessages.length).toEqual(2);
	});
	it("should render error messages if handle fetch fails", async () => {
		const user = userEvent.setup();
		const mockOutletContext = {
			setToken: vi.fn(),
		};

		handleFetch.mockImplementationOnce(() => {
			throw new Error("Fetch Error", {
				cause: [
					{
						field: "email",
						message: "error",
					},
					{
						field: "password",
						message: "error",
					},
				],
			});
		});

		render(
			<Providers {...mockOutletContext}>
				<Login />
			</Providers>
		);

		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Password");
		const submitBtn = screen.getByRole("button", { name: "Login" });

		await user.type(emailInput, "example@gmail.com");
		await user.type(passwordInput, "1!Qwerty");

		await user.click(submitBtn);

		const defaultErrorMessages = screen.queryAllByText(
			"Error message placeholder"
		);

		expect(defaultErrorMessages.length).toEqual(0);
		expect(handleFetch).toBeCalledTimes(1);
	});
});
