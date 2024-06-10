import { vi, describe, it, expect } from "vitest";
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../components/App";

import handleColorScheme from "../utils/handleColorScheme";
import handleFetch from "../utils/handleFetch";

vi.mock("../utils/handleColorScheme");
vi.mock("../utils/handleFetch");

/* eslint-disable react/prop-types */
vi.mock("../contexts/AppContext", async importOriginal => {
	const mod = await importOriginal();
	return {
		...mod,
		AppProvider: ({ token, children }) => {
			return (
				<div>
					<p>{token}</p>
					{children}
				</div>
			);
		},
	};
});

vi.mock("../components/Header.jsx", () => ({
	default: ({ handleSwitchColorTheme, user }) => (
		<div>
			<button onClick={handleSwitchColorTheme}>Header component</button>
			{user && <p data-testid="header">{user.name}</p>}
		</div>
	),
}));

vi.mock("../components/Loading.jsx", () => ({
	default: () => <p>Loading component</p>,
}));

vi.mock("../components/Contact.jsx", () => ({
	default: () => <p>Contact component</p>,
}));

vi.mock("../components/Footer.jsx", () => ({
	default: () => <p>Footer component</p>,
}));

describe("App component", () => {
	it("should render dark class name if darkTheme is true ", async () => {
		const user = userEvent.setup();
		handleColorScheme.mockReturnValueOnce(false);

		render(<App />);

		const headerBtn = screen.getByRole("button", {
			name: "Header component",
		});

		await user.click(headerBtn);

		const element = screen.getByTestId("app");

		expect(handleColorScheme).toBeCalledTimes(1);
		expect(element).toHaveClass("dark");
	});
	it("should render content if the local storage has not stored a token.", () => {
		global.localStorage = {
			getItem: vi.fn(() => null),
		};

		render(<App />);

		const element = screen.getByTestId("app");

		expect(element).toBeInTheDocument();
	});
	it("should delete the old token if it expires.", () => {
		const mockToken = {
			token: "example",
			exp: Date.now() - 1,
		};

		global.localStorage = {
			getItem: vi.fn(() => JSON.stringify(mockToken)),
			removeItem: vi.fn(),
		};

		render(<App />);

		expect(localStorage.removeItem).toBeCalledTimes(1);
	});
	it("should render the Loading component then set user info if the 'handleGetUser' fetch result is successfully", async () => {
		const mockToken = {
			token: "exampleToken",
			exp: Date.now() + 100,
		};

		const mockResult = {
			success: true,
			data: {
				name: "exampleName",
			},
		};
		handleFetch.mockReturnValueOnce(mockResult);

		global.localStorage = {
			getItem: vi.fn(() => JSON.stringify(mockToken)),
		};

		render(<App />);

		const loading = screen.getByText("Loading component");

		expect(loading).toBeInTheDocument();

		await waitForElementToBeRemoved(loading);

		const token = screen.getByText("exampleToken");
		const userName = screen.getByText("exampleName");

		expect(token).toBeInTheDocument();
		expect(userName).toBeInTheDocument();
	});
	it("should prints error message to console if the 'handleGetUser' fetch result is fails", async () => {
		const mockToken = {
			token: "exampleToken",
			exp: Date.now() + 100,
		};

		const mockResult = {
			success: false,
			message: "error",
		};
		handleFetch.mockReturnValueOnce(mockResult);

		global.localStorage = {
			getItem: vi.fn(() => JSON.stringify(mockToken)),
		};

		global.console = {
			error: vi.fn(),
		};

		render(<App />);

		await waitForElementToBeRemoved(screen.getByText("Loading component"));

		expect(console.error).toBeCalledTimes(1);
	});
	it("should prints error message to console if the 'handleGetUser' fetch is fails", async () => {
		const mockToken = {
			token: "exampleToken",
			exp: Date.now() + 100,
		};

		handleFetch.mockImplementationOnce(() => {
			throw new Error("Fetch Error");
		});

		global.localStorage = {
			getItem: vi.fn(() => JSON.stringify(mockToken)),
		};

		global.console = {
			error: vi.fn(),
		};

		render(<App />);

		expect(console.error).toBeCalledTimes(1);
	});
});
