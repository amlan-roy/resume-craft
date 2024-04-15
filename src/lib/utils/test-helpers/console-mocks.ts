const expectError = (
  expectedError?: string | Error | Array<string> | Array<Error>
) => {
  jest.spyOn(console, "error").mockImplementation((e) => {
    if (expectedError instanceof Error) {
      if (e.toString().includes(expectedError.message)) {
        return;
      }
    } else if (Array.isArray(expectedError)) {
      if (
        expectedError.some((error) => e.toString().includes(error.toString()))
      ) {
        return;
      }
    } else {
      if (e.toString().includes(expectedError)) {
        return;
      }
    }
    throw e;
  });
};

export { expectError };

// Todo: Replace all manual console.error mocks from tests and use this helper instead
// Refer __tests__\integration\components\my-resumes\ResumeCard.test.tsx for reference
