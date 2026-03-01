const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./*.html", "./*.js"],
    theme: {
        extend: {
            animation: {
                aurora: "aurora 60s linear infinite",
                fadeUp: "fadeUp 0.8s ease-in-out forwards",
            },
            keyframes: {
                aurora: {
                    from: { backgroundPosition: "50% 50%, 50% 50%" },
                    to: { backgroundPosition: "350% 50%, 350% 50%" },
                },
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(40px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [addVariablesForColors],
};

// Plugin: injects all Tailwind colors as CSS --color-* variables
function addVariablesForColors({ addBase, theme }) {
    const allColors = flattenColorPalette(theme("colors"));
    const newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--color-${key}`, val])
    );
    addBase({ ":root": newVars });
}
