import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import Loading from "../components/Loading";

describe("Loading component", () => {
	it("should render correctly", () => {
		const { asFragment } = render(<Loading />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
