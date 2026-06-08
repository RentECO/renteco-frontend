# renteco-frontend
# EcoRent Login Page

This repository contains a single HTML landing/login page for an EcoRent-style borrowing platform.

## Overview

- **File:** `login-page.html`
- **Purpose:** Frontend prototype for login and registration flow
- **Technologies:**
  - HTML
  - Tailwind CSS (via CDN)
  - Vanilla JavaScript

## Features

- Clean responsive login/register card layout
- Toggle between Login and Sign Up views
- Client-side password confirmation for registration
- Status messages for success and error states
- Lightweight styling with custom eco-themed colors

## Usage

1. Open `login-page.html` in a browser.
2. Use the form to switch between sign in and sign up.
3. The form is wired to send JSON to backend endpoints:
   - `/api/login`
   - `/api/register`

> Note: This project is currently a frontend prototype only and does not contain a working backend.

## Customization

- Update colors via the Tailwind config block in the page
- Modify the form labels, placeholders, or validation logic inside the `<script>` block
- Replace the fetch URLs with your backend service routes

## License

This project is provided as-is for prototyping and demo purposes.
