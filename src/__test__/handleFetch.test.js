import { vi, describe, it, expect } from "vitest";

import handleFetch from "../utils/handleFetch";

describe("handleFetch function", () => {
	it("should return the data when the fetch successful.", async () => {
		const mockData = [];

		const mockJson = { json: vi.fn(() => mockData) };

		global.fetch = vi.fn(() => mockJson);

		const actual = await handleFetch();

		const expected = mockData;

		expect(actual).toEqual(expected);
	});
});
