## It with examples
######_Specification-by-example style specs for Jasmine and Jest_

### Installation

```
#For Yarn
yarn add it-with-examples --dev
```

```
#For NPM
npm install it-with-examples --save-dev
```

### Use
##### It With Examples
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

````
>should show a warning message when the user submits the form without a email field
>should show a warning message when the user submits the form without a username field
>should show a warning message when the user submits the form without a password field
````

##### Flags


##### Focused It With Examples

##### Excluded It With Examples



### Further Notes
 