/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          emd: {
            blue: {
              900: "#1e3a8a",
              800: "#1e40af",
              700: "#1d4ed8",
            },
            orange: {
              500: "#f97316",
              600: "#ea580c",
            },
          },
        },
        fontFamily: {
          sans: [
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "sans-serif",
          ],
        },
      },
    },
    plugins: [],
  };
  