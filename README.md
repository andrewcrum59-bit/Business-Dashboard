# Business Dashboard
[View Live Demo](https://andrewcrum59-bit.github.io/Business-Dashboard/)
An interactive dashboard built with HTML, CSS, and vanilla JavaScript.

Users can add, search, and delete orders. Summary cards calculate
revenue, order count, and unique customer names from the saved orders.

## Features

- Add and delete orders
- Search orders by customer name
- Automatically calculate summary totals
- Save orders and card positions in localStorage
- Rearrange summary cards using mouse dragging
- Responsive layout and animated sales bars
- Keyboard focus indicators and reduced-motion support

## Run locally

Open the project folder in VS Code, then open index.html using
the Live Server extension.

## How it works

HTML structures the page, CSS controls its appearance and layout,
and JavaScript handles interactions and browser storage.

Revenue is calculated in cents when summarizing orders to reduce
floating-point rounding errors.

## Limitations

- Data stays in the current browser and does not sync across devices.
- Clearing browser storage removes saved data.
- Customers are identified by name, ignoring capitalization.
- The monthly sales chart uses illustrative sample data.
- Card rearranging currently supports mouse dragging.
- This is a portfolio demo, not a production order-management system.

## What I learned

I practiced DOM manipulation, event listeners, form validation,
responsive CSS, and saving data with localStorage.
