import { cleanFormData } from "@/lib/utils/data-formatting";

describe("unit:utils/dataformatting:cleanFormData", () => {
  it("should remove undefined values", () => {
    const values = {
      name: "John",
      age: undefined,
      city: "New York",
    };

    const cleanedData = cleanFormData(values);

    expect(cleanedData).toEqual({ name: "John", city: "New York" });
  });

  it("should remove null values", () => {
    const values = {
      name: "John",
      age: null,
      city: "New York",
    };

    const cleanedData = cleanFormData(values);

    expect(cleanedData).toEqual({ name: "John", city: "New York" });
  });

  it("should remove empty strings", () => {
    const values = {
      name: "John",
      email: "",
      city: "New York",
    };

    const cleanedData = cleanFormData(values);

    expect(cleanedData).toEqual({ name: "John", city: "New York" });
  });

  it("should remove empty objects", () => {
    const values = {
      name: "John",
      address: {},
      city: "New York",
    };

    const cleanedData = cleanFormData(values);

    expect(cleanedData).toEqual({ name: "John", city: "New York" });
  });

  it("should handle nested objects", () => {
    const values = {
      name: "John",
      profile: {
        age: 30,
        hobbies: [],
      },
    };

    const cleanedData = cleanFormData(values);

    expect(cleanedData).toEqual({ name: "John", profile: { age: 30 } });
  });

  it("should handle arrays", () => {
    const values = {
      name: "John",
      skills: ["JavaScript", "", null],
    };

    const cleanedData = cleanFormData(values);

    expect(cleanedData).toEqual({ name: "John", skills: ["JavaScript"] });
  });
});
