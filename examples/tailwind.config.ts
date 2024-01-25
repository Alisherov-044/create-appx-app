import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./**/*.{js,ts,jsx,tsx,mdx,html}",
        "./src/**/*.{js,ts,jsx,tsx,mdx,html}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
export default config;
