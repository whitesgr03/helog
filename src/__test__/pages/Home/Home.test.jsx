import { vi, describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Home from "../components/Home";

vi.mock("../components/Posts");

describe("Home component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Home />, { wrapper: BrowserRouter });

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
