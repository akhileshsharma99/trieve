const preset = require("config/tailwind");
const {
  scopedPreflightStyles,
  isolateInsideOfContainer,
} = require("tailwindcss-scoped-preflight");
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["src/**/*.tsx"],
  presets: [preset],
  plugins: [
    require("@tailwindcss/forms"),
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer(
        [
          "#trieve-search-component",
          "#trieve-search-modal",
          "#trieve-search-modal-overlay",
        ],
        {
          rootStyles: true,
        }
      ),
    }),
  ],
  theme: {
    extend: {
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
};
