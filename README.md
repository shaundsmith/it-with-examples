## It with examples
######_Specification-by-example style specs for Jasmine and Jest_

It-with-examples is a small extension to Jest and Jasmine in order to allow examples to be passed into the specs.
The overall goal is to improve the BDD experience with JavaScript unit testing frameworks, allowing multiple examples to be specified for a single spec.
Each example will be ran as a separate spec, passing in the example as variables in the spec.

### Installation

```sh
#For Yarn
yarn add it-with-examples --dev
```


```sh
#For NPM
npm install it-with-examples --save-dev
```

## Use
To use It-with-examples within your specs, you'll need to specify it as a helper function:

jasmine.json
```javascript
{
  ...
  "helpers": [
    "../node_modules/it-with-examples/index.js"
  ]
}
```

If you're using the Karma test runner
karma.config.js
```javascript
    files: [
        {pattern: "node_modules/it-with-examples/*.js", served: true, included: true}
    ]
```


### It With Examples
The main function within it-with-examples is the `eit` function. `eit` stands for example-it, and provides an additional parameter to the standard Jasmine/Jest `it` function.
```javascript
eit(specName, specFunction, examples, timeout = Jasmine default timeout)
```
The spec name and spec function parameters feature some slight modifications to the standard Jasmine/Jest `it` parameters.

* The spec name allows the use of placeholder in order to differentiate between the examples
* The spec function requires a `data` parameter, which will relate to the example that is to be run by the test
* The examples parameter is an array of values. Each value in the array will be run as a single Jasmine/Jest test.
* The timeout parameter is optional, and defaults to the Jasmine timeout default. If you are not using Jasmine then it will default to 5 seconds.

Example:

```javascript
eit("should show a warning message when the user submits the form without a {field} value", data => {
    renderFormWidget();
    
    setFieldAsEmpty(data.field);
    submitForm();
    
    expect(formMessages()).toContain(data.expectedMessage);
}, [
  {field: "email", expectedMessage: "Missing email"},
  {field: "username", expectedMessage: "Missing username"},
  {field: "password", expectedMessage: "Missing password"} 
]);

```
This will produce each example as a separate test, substituting any placeholders in the spec name.
The placeholders relate to the keys in the example objects. Running the above function will produce the following specs:
````
>should show a warning message when the user submits the form without a email field
>should show a warning message when the user submits the form without a username field
>should show a warning message when the user submits the form without a password field
````

Alternatively, the list of examples can simply be an array of primitive values, e.g.
```javascript
eit("should show a warning message when the user submits the form without a {} value", field => {
    renderFormWidget();
    
    setFieldAsEmpty(field);
    submitForm();
    
    expect(form).toHaveWarning();
}, [
  "email",
  "username",
  "password"
]);
```
For primitives, the placeholder is simply `{}`.

### Asynchronous Tests

With Jasmine and Jest your spec function can take an optional parameter, `done`, which allows the spec to wait until any asynchronous events have finished. It-with-examples retains this functionality by using a second, optional parameter on the spec function.
```javascript
eit("should show a warning message when the user submits the form without a {} value", (field, done) => {
    submitForm();
    onFormSubmit(() => {
        expect(successNotice()).toBePresent();
        done();
    });
}, [
  "email",
  "username",
  "password"
]);
```


### Flags
Jasmine and Jest feature the ability to exclude (`xit`) and focus (`fit`) specs. A "flag" parameter can be passed into each of the examples in order to specify whether they will be excluded or focused.
```
//Flags
'f' - focused
'x' - excuded
```
Any examples without a flag, or with an invalid flag, will be defaulted to using the standard `it`-style specs*.

Example:
```javascript
eit("should show a warning message when the user submits the form without a {field} value", data => {
    ...
}, [
  {field: "email", expectedMessage: "Missing email", flag: 'f'},
  {field: "username", expectedMessage: "Missing username", flag: 'f'},
  {field: "password", expectedMessage: "Missing password", flag: 'x'} 
]);

```

### Release Versions
0.0.1 Initial release
 