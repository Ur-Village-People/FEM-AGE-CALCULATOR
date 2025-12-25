# Frontend Mentor - Age calculator app solution

This is a solution to the [Age calculator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/age-calculator-app-dF9DFFpj-Q).

## Table of contents

- [Frontend Mentor - Age calculator app solution](#frontend-mentor---age-calculator-app-solution)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
    - [The challenge](#the-challenge)
    - [Screenshot](#screenshot)
    - [Links](#links)
  - [My process](#my-process)
    - [What I learned](#what-i-learned)

## Overview

### The challenge

Users should be able to:

- View an age in years, months, and days after submitting a valid date through the form.
- Receive validation errors if:
  - Any field is empty when the form is submitted.
  - The day number is not between 1-31.
  - The month number is not between 1-12.
  - The year is in the future.
  - The date is invalid (e.g., 31/04/1991).
- View the optimal layout for the interface depending on their device's screen size.
- See hover and focus states for all interactive elements on the page.

### Screenshot

![Age Calculator App Preview](./preview.jpg)

### Links

- Solution URL: [Add your GitHub URL here]
- Live Site URL: [Add your live site URL here]

## My process

### What I learned

In this project, I focused on creating a robust validation system that provides immediate visual feedback. One of the key technical challenges was ensuring the error styling correctly applied to multiple elements (labels and inputs) simultaneously.

I learned how to use **SCSS nesting and modifier classes** to toggle "error states" efficiently. By adding a single class (`--error`) to a parent field container via JavaScript, I could use CSS to transform the entire input group:



On the JavaScript side, I practiced writing clean, modular code. I used shorthand parameters in my validation functions to keep the logic concise and readable. I also implemented a specific check for empty values to distinguish between a "missing field" error and an "invalid data" error.

```javascript
// Example of short-hand parameter usage for d (day), m (month), y (year)
function validate(d, m, y) {
  // Logic to handle empty fields vs invalid numbers
}