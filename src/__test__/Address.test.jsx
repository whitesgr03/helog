import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import Address from "../components/Address";

describe("Address component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Address />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
