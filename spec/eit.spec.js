require("../index");

describe("it with example specs", () => {

    describe("spec name substitution specs", () => {

        it("should substitute in the object's keys into the placeholders", () => {
            const substitutedNames = [];

            // Redefine 'it' to capture the name - this is refreshed by the test context so we don't need to worry about affecting future tests
            it = (name) => {
                substitutedNames.push(name);
            };

            eit("should substitute {value} into the {number} test: {value}", (value) => {
            }, [
                {value: "value 1", number: "number 1"},
                {value: "value 2", number: "number 2"}
            ]);

            expect(substitutedNames[0]).toBe("should substitute value 1 into the number 1 test: value 1");
            expect(substitutedNames[1]).toBe("should substitute value 2 into the number 2 test: value 2");
        });

        it("should substitute in the primitives into the empty placeholders", function () {
            const substitutedNames = [];
            // Redefine 'it' to capture the name - this is refreshed by the test context so we don't need to worry about affecting future tests
            it = (name) => {
                substitutedNames.push(name);
            };

            eit("should substitute primitive '{}' into the test: {}", (value) => {
            }, [
                "string",
                6,
                true
            ]);

            expect(substitutedNames[0]).toBe("should substitute primitive 'string' into the test: string");
            expect(substitutedNames[1]).toBe("should substitute primitive '6' into the test: 6");
            expect(substitutedNames[2]).toBe("should substitute primitive 'true' into the test: true");
        });

    });

    describe("spec parameters specs", () => {

        it("should require the spec function to contain at least single parameter for the example's value", () => {
            expect(
                () => eit("example eit", () => {
                }, [1, 2, 3])
            ).toThrowError("Invalid number of parameters provided on the spec's function. Spec function must use either one or two parameters");
        });

        it("should allow the 'done' parameter to be passed in as the second parameter to the example spec function", () => {
            const doneProvided = [];
            it = (specName, callback) => {
                doneProvided.push(callback.length === 1);
            };

            eit("should substitute primitive '{}' into the test: {}", (value, done) => {}, [1, 2, 3]);

            expect(doneProvided).toEqual([true, true, true]);
        });

        it("should require an array of examples", () => {
            expect(
                () => eit("spec name", (value) => {}, {})
            ).toThrowError("Examples must be an array of objects or primitives");
        });

    });

    describe("type flag specs", () => {

        it("should perform an fit-style spec for examples with the 'f' flag parameter", () => {
            let fitTriggered = false;
            fit = () => {
                fitTriggered = true;
            };

            eit("should use fit", (value) => {}, [{a: 1, flag: 'f'}]);

            expect(fitTriggered).toBeTruthy();
        });

        it("should perform an xit-style spec for examples with the 'x' flag parameter", () => {
            let xitTriggered = false;
            xit = () => {
                xitTriggered = true;
            };

            eit("should use xit", (value) => {}, [{a: 1, flag: 'x'}]);

            expect(xitTriggered).toBeTruthy();
        });

        it("should perform an it-style spec for examples with the no flag parameter", () => {
            let itTriggered = false;
            it = () => {
                itTriggered = true;
            };

            eit("should use it", (value) => {}, [{a: 1}]);

            expect(itTriggered).toBeTruthy();
        });

    });

    describe("flagged variation specs", () => {
        it("should run all flagless examples as focused specs when using feit", () => {
            let fitCount = 0;
            fit = () => {
                fitCount++;
            };
            xit = () => fail("xit was run");
            it = () => fail("it was run");

            feit("should use fit", (value) => {}, [1, {a: 5}, {flag: null}]);

            expect(fitCount).toBe(3);
        });

        it("should run all flagless examples as pending specs when using xeit", () => {
            let xitCount = 0;
            xit = () => {
                xitCount++;
            };
            fit = () => fail("fit was run");
            it = () => fail("it was run");

            xeit("should use xit", (value) => {}, [1, {a: 5}, {flag: null}]);

            expect(xitCount).toBe(3);
        });

        it("should not overwrite flagged examples when using feit", () => {
            let fitCount = 0;
            let xitCount = 0;
            fit = () => {
                fitCount++;
            };
            xit = () => {
                xitCount++;
            };
            it = () => fail("it was run");

            feit("should use xit", (value) => {}, [{a: 5}, {flag: 'x'}]);

            expect(fitCount).toBe(1);
            expect(xitCount).toBe(1);
        });

        it("should not overwrite flagged examples when using xeit", () => {
            let fitCount = 0;
            let xitCount = 0;
            fit = () => {
                fitCount++;
            };
            xit = () => {
                xitCount++;
            };
            it = () => fail("it was run");

            xeit("should use xit", (value) => {}, [{a: 5}, {flag: 'f'}]);

            expect(fitCount).toBe(1);
            expect(xitCount).toBe(1);
        });
    });

    describe("timeout specs", () => {

        it("should allow a timeout value to be specified", () => {
            let timeout = 0;
            it = (specName, specFunction, specTimeout) => {
                timeout = specTimeout;
            };

            eit("timeout", (value) => {}, [1, 2], 10000);

            expect(timeout).toBe(10000);
        });

        it("should use the Jasmine default timeout value if no timeout is specified", () => {
            let timeout = 0;
            it = (specName, specFunction, specTimeout) => {
                timeout = specTimeout;
            };

            eit("timeout", (value) => {}, [1, 2]);

            expect(timeout).toBe(jasmine.DEFAULT_TIMEOUT_INTERVAL);
        });

        xit("should use a timeout of 5 seconds if Jasmine is not available");

    });

    describe("real example specs", () => {

        let lessThanFiveWidget, requestSendingWidget;

        eit("should allow {method} type requests to be sent", (data) => {
            const isMessageSent = requestSendingWidget(data.method);

            expect(isMessageSent).toBeTruthy();
        }, [
            {method: "put"},
            {method: "post"},
            {method: "get"}
        ]);

        eit("should throw an error if the input is less than 5", (data) => {
            expect(() => lessThanFiveWidget(data)).toThrowError("value is less than 5");
        }, [
            0, 1, 2, 3, 4
        ]);

        beforeEach(() => {
            requestSendingWidget = (value) => {
                const allowedTypes = ["get", "put", "post"];
                return allowedTypes.indexOf(value) >= 0;
            };

            lessThanFiveWidget = (value) => {
                if (value < 5) {
                    throw new Error("value is less than 5");
                }
            };
        })



    });


});