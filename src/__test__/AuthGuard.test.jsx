import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";

import AuthGuard from "../components/AuthGuard";

/* eslint-disable react/prop-types */
const Providers = ({ children, ...props }) => {
	return (
		<MemoryRouter initialEntries={["/auth"]}>
			<Routes>
				<Route path="/" element={<div>Previous page</div>} />
				<Route element={<Outlet context={{ ...props }} />}>
					<Route path="/auth" element={children} />
				</Route>
			</Routes>
		</MemoryRouter>
	);
};

describe("PostList component", () => {
	it("should render previous page if user is truly", () => {
		const mockOutContext = {
			user: {},
		};

		render(
			<Providers {...mockOutContext}>
				<AuthGuard>
					<div>children</div>
				</AuthGuard>
			</Providers>
		);

		const element = screen.getByText("Previous page");

		expect(element).toBeInTheDocument();
	});
	it("should render children prop if user is falsy", () => {
		const mockOutContext = {
			user: null,
		};

		render(
			<Providers {...mockOutContext}>
				<AuthGuard>
					<div>children</div>
				</AuthGuard>
			</Providers>
		);

		const element = screen.getByText("children");

		expect(element).toBeInTheDocument();
	});
});
