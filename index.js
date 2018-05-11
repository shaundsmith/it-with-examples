/**
 * It With Examples
 *
 * Focused on BDD and specification-by-example, the it with examples function allows the use of spec examples within Jasmine, Jest, and Mocha.
 * It works in a similar manner to Scenario Outlines in Cucumber, running each spec with the values of single row of the examples
 *
 * For help on using this within your code, see the README on the project's page:
 * @url https://bitbucket.org/shaunyprawn/it-with-examples/
 *
 * @author Shaun Smith
 * @version 0.0.1
 */
(function () {

    /**
     * It with examples function
     * Runs the specified spec function for each of the entries in the examples array
     * The spec name has any placeholders substituted with the examples' examples to differentiate the specs
     *
     * The default flag cannot be specified by the end-user, but is used to differentiate between the variations of the 'it' function
     *
     * If the examples aren't an array then an error is thrown
     *
     * @param specName name of the scenario/spec to run, with placeholders for the required examples
     * @param specFunction function to call containing the spec test code
     * @param examples array of example examples
     * @param timeout (optional) timeout interval for the spec
     * @param flagDefault (optional) sets a default flag for all examples
     * @return array of scenarios/specs
     */
    var itWithExamples = function (specName, specFunction, examples, timeout, flagDefault) {
        if (!(examples instanceof Array)) {
            throw new Error("Examples must be an array of objects or primitives");
        }

        return examples.map(function (value) {
            var scenarioName = substituteExampleValuesInSpecName(specName, value),
                scenarioFunction = generateSpecFunction(specFunction, value),
                itType = getItFunction(value, flagDefault);
            return itType(scenarioName, scenarioFunction, timeout || getDefaultTimeout());
        });
    };

    /**
     * Substitute the examples' values into the spec name.
     *      If the examples values are an object, then the placeholders are based on the object's keys
     *      If the examples' values are purely primitive values then only an empty placeholder is required
     *
     *      Example 1:
     *          exampleValues = {originalValue: 20, expectedValue: 50}
     *          specName = "it should add 30 to {originalValue} to produce {expectedValue}
     *          result = "it should add 30 to 20 to produce 50
     *
     *      Example 2:
     *          exampleValues = "test string"
     *          specName = "it should produce '{}'"
     *          result = "it should produce 'test string'
     *
     * @param specName scenario name
     * @param exampleValues values to substitute in
     * @returns {string} substituted scenario name
     */
    var substituteExampleValuesInSpecName = function (specName, exampleValues) {
        var substitutedSpecName = specName;
        if (typeof exampleValues === "object") {
            Object.keys(exampleValues).forEach(function (key) {
                if (exampleValues.hasOwnProperty(key)) {
                    substitutedSpecName = substitutedSpecName.replace(new RegExp("\{" + key + "\}", "g"), exampleValues[key]);
                }
            });
        } else {
            substitutedSpecName = substitutedSpecName.replace(/{}/g, exampleValues);
        }
        return substitutedSpecName;
    };

    /**
     * Generate the spec function based on the it-with-examples parameters
     *      A single parameter denotes that only the data is to be passed through,
     *      Two parameters denotes that the 'done' parameter is to be passed into the test
     *      If 0, or >2 parameters are provided then an error is thrown
     *
     * @param rawSpecFunction the spec function to use for each of the examples
     * @param value the value to pass into the spec function
     * @returns the function to use for the scenario
     */
    var generateSpecFunction = function (rawSpecFunction, value) {
        var specFunction;
        if (rawSpecFunction.length === 1) {
            specFunction = function () {
                rawSpecFunction(value);
            }
        } else if (rawSpecFunction.length === 2) {
            specFunction = function (done) {
                rawSpecFunction(value, done);
            }
        } else {
            throw Error("Invalid number of parameters provided on the spec's function. Spec function must use either one or two parameters")
        }
        return specFunction;
    };

    /**
     * Get the default timeout interval. If a timeout interval cannot be obtained, set it to 5 seconds
     * @returns {number} default timeout interval
     */
    var getDefaultTimeout = function () {
        var timeout = 5000;
        if (typeof jasmine !== "undefined") {
            timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        }
        return timeout;
    };

    /**
     * Get the 'it' function to use, based on the 'flag' key in the example object
     * If the value is not an object, then the default will be used
     *
     * The defaultFlag parameter allows a default flag to be provided to all examples that do not already specify one
     *
     *  'focused' or 'only' will produce a focused-it (fit) function
     *  'disabled' or 'ignored' will produce a disabled-it (xit) function
     *  anything else will result in the standard it function
     *
     *
     * If a defaultFlag is provided then
     * @param exampleValue example's value
     * @param defaultFlag (optional) default flag to use
     * @returns {fit|xit|it} it function to use for the tests
     */
    var getItFunction = function (exampleValue, defaultFlag) {
        var itFunction,
            flag = typeof exampleValue === "object" ? exampleValue.flag : "";
        if (defaultFlag) {
            flag = flag || defaultFlag;
        }
        switch (flag) {
            case "f":
                itFunction = fit;
                break;
            case "x":
                itFunction = xit;
                break;
            default:
                itFunction = it;
        }
        return itFunction;
    };


    var exampleIt = function (specName, specFunction, examples, timeout) {
        return itWithExamples(specName, specFunction, examples, timeout);
    };
    var focusedExampleIt = function (specName, specFunction, examples, timeout) {
        return itWithExamples(specName, specFunction, examples, timeout, 'f');
    };
    var excludedExampleIt =function (specName, specFunction, examples, timeout) {
        return itWithExamples(specName, specFunction, examples, timeout, 'x');
    };


    if (typeof global !== "undefined") {
        global.eit = exampleIt;
        global.feit = focusedExampleIt;
        global.xeit = excludedExampleIt;
    }
    if (typeof window !== "undefined") {
        window.eit = exampleIt;
        window.feit = focusedExampleIt;
        window.xeit = excludedExampleIt;
    }

})();