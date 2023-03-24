export class PlayerFixture {
  static keysInResponse() {
    return ["id", "name"];
  }

  static arrangeForSave() {
    return [
      {
        send_data: {
          name: "John Doe",
        },
        expected: {
          name: "John Doe",
        },
      },
    ];
  }

  static arrangeForEntityValidationError() {
    const defaultExpected = {
      statusCode: 422,
      error: "Unprocessable Entity",
    };

    return [
      {
        label: "EMPTY",
        send_data: {},
        expected: {
          message: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
          ...defaultExpected,
        },
      },
      {
        label: "NAME_UNDEFINED",
        send_data: {
          name: undefined,
        },
        expected: {
          message: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
          ...defaultExpected,
        },
      },
      {
        label: "NAME_NULL",
        send_data: {
          name: null,
        },
        expected: {
          message: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
          ...defaultExpected,
        },
      },
      {
        label: "NAME_EMPTY",
        send_data: {
          name: "",
        },
        expected: {
          message: ["name should not be empty"],
          ...defaultExpected,
        },
      },
    ];
  }
}

export class CreatePlayerFixture {
  static keysInResponse() {
    return PlayerFixture.keysInResponse();
  }

  static arrangeForSave() {
    return PlayerFixture.arrangeForSave();
  }

  static arrangeForEntityValidationError() {
    return PlayerFixture.arrangeForEntityValidationError();
  }
}
