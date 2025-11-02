# **App Name**: FireCalc

## Core Features:

- Basic and Scientific Calculations: Performs standard arithmetic, trigonometric, logarithmic, and exponential operations with a clear display.
- User Authentication: Secure user login via email and Google using Firebase Authentication.
- Calculation History Storage: Saves each user's calculation history securely in Firestore.
- User-Specific Data: Firestore rules ensure each user can only access their own data.
- Clear History Functionality: Enables users to delete their entire calculation history.
- Adaptive Mode Switching: Automatically determines the appropriate mode (Standard/Scientific) for evaluation when users enter their calculations.

## Style Guidelines:

- Primary color: Dark slate blue (#483D8B), lending a sense of precision and intelligence.
- Background color: Light gray (#D3D3D3), to ensure readability of displayed calculations.
- Accent color: Electric indigo (#6F00ED) to provide contrast for interactive elements like buttons, while remaining analogous to the primary color.
- Body and headline font: 'Inter', a sans-serif font that offers a modern and neutral appearance suitable for a calculator interface.
- Use clean, minimalist icons for operations and functions to enhance usability.
- Implement a responsive grid layout that adapts to different screen sizes and maintains a structured interface.
- Incorporate subtle animations on button clicks and mode transitions for a smooth user experience.