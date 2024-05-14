import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Header from "../components/Header";

describe("Header component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Header />, {
			wrapper: BrowserRouter,
		});

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
