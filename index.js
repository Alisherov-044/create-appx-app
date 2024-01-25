#!/usr/bin/env node

import os from "os";
import fs from "fs";
import path from "path";
import pkg from "picocolors";
import prompts from "prompts";
import Commander from "commander";
import childProcess from "child_process";
import chalkAnimation from "chalk-animation";

const { red, green, gray, yellow } = pkg;

export const SRC_DIR_NAMES = [
    "app",
    "data",
    "utils",
    "pages",
    "hooks",
    "styles",
    "context",
    "components",
];

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const defaultPreferences = {
    name: "appx-app",
    language: {
        title: "Typescript",
        value: "typeScript",
    },
    style: {
        title: "SCSS",
        value: "scss",
    },
    eslint: true,
    src: true,
    router: {
        title: "App router",
        value: "app",
    },
    unit: false,
    e2e: false,
    ui: "none",
    animation: "none",
    packageManager: "yarn",
    alias: "@/*",
};

const userPreferences = { ...defaultPreferences };

const program = new Commander.Command("create-appx-app")
    .arguments("<project-path>")
    .usage(`${green("<project-path>")} [options]`)
    .action((name) => {
        if (typeof name === "string") {
            userPreferences.name = name;
        }
    })
    .option(
        "--ts, --typescript",
        `

  Initialize as a TypeScript project. (default)
`
    )
    .option(
        "--js, --javascript",
        `

  Initialize as a JavaScript project.
`
    )
    .option(
        "--css",
        `

  Initialize with CSS config.
`
    )
    .option(
        "--scss",
        `

  Initialize with SCSS config. (default)
`
    )
    .option(
        "--tailwind, --tailwindcss",
        `

  Initialize with Tailwind CSS config.
`
    )
    .option(
        "--styled-components",
        `

  Initialize with Styled Components CSS config.
`
    )
    .option(
        "--eslint",
        `

  Initialize with eslint config.
`
    )
    .option(
        "--page, --page-router",
        `

  Initialize as Page Router project.
`
    )
    .option(
        "--app, --app-router",
        `

  Initialize as an App Router project. (default)
`
    )
    .option(
        "--src, --src-dir",
        `

  Initialize inside a \`src/\` directory.
`
    )
    .option(
        "--use-npm",
        `

  Explicitly tell the CLI to bootstrap the application using npm
`
    )
    .option(
        "--use-pnpm",
        `

  Explicitly tell the CLI to bootstrap the application using pnpm
`
    )
    .option(
        "--use-yarn",
        `

  Explicitly tell the CLI to bootstrap the application using Yarn
`
    )
    .option(
        "--use-bun",
        `

  Explicitly tell the CLI to bootstrap the application using Bun
`
    )
    .option(
        "--gsap",
        `

  Initialize with gsap config.
`
    )
    .option(
        "--framer-motion",
        `

  Initialize with framer motion config.
`
    )
    .option(
        "--unit",
        `

  Initialize with jest & react-testing-library config.
`
    )
    .option(
        "--e2e",
        `

  Initialize with cypress config.
`
    )
    .allowUnknownOption()
    .parse(process.argv);

async function createAppxApp() {
    const {
        name,
        alias,
        animation,
        e2e,
        eslint,
        language,
        packageManager,
        router,
        src,
        style,
        ui,
        unit,
    } = userPreferences;

    // TODO: create page router scheme

    if (![".", "./"].includes(name)) {
        fs.mkdir(`${name}`, { recursive: true }, (err) => {
            if (err) {
                console.error(red(err));
            }
        });
    }

    if (fs.existsSync(`${name}/package.json`)) {
        console.error(red("\n Error: package.json already exists!"));
        process.exit(1);
    }

    const packageJson = {
        name,
        version: "0.1.0",
        private: true,
        scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint",
        },
        dependencies: {
            next: "14.0.4",
            react: "^18",
            "react-dom": "^18",
        },
        devDependencies: {},
    };

    const jsConfigJson = {
        compilerOptions: {
            paths: {
                [alias]: [src ? "./src/*" : "./*"],
            },
        },
    };

    const tsConfigJson = {
        compilerOptions: {
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: "esnext",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "preserve",
            incremental: true,
            plugins: [
                {
                    name: "next",
                },
            ],
            paths: {
                [alias]: [src ? "./src/*" : "./*"],
            },
        },
        include: [
            "next-env.d.ts",
            "**/*.ts",
            "**/*.tsx",
            ".next/types/**/*.ts",
        ],
        exclude: ["node_modules"],
    };

    const getExtension = () => {
        return typeof language !== "string"
            ? language.value === "typescript"
                ? "ts"
                : "js"
            : "ts";
    };

    const isTS = language.value === "typescript";

    const getExtensionJSX = () => {
        return typeof language !== "string"
            ? language.value === "typescript"
                ? "tsx"
                : "jsx"
            : "tsx";
    };

    childProcess.execSync(`git init -b main`, { cwd: name });

    fs.writeFileSync(
        `${name}/.prettierrc`,
        `{
    "semi": true,
    "singleQuote": false,
    "bracketSpacing": true,
    "tabWidth": 4
}
        ` + os.EOL
    );
    fs.writeFileSync(
        `${name}/.gitignore`,
        `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies

/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing

/coverage

# next.js

/.next/
/out/

# production

/build

# misc

.DS_Store
\*.pem

# debug

npm-debug.log*
yarn-debug.log*
yarn-error.log\*

# local env files

.env\*.local
.env

# vercel

.vercel

# typescript

\*.tsbuildinfo
next-env.d.ts
    ` + os.EOL
    );
    fs.writeFileSync(
        `${name}/README.md`,
        `This is a [Next.js](https://nextjs.org/) project bootstrapped with [\`create-appx-app\`](https://github.com/Alisherov-044/create-appx-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying \`app/(home)/page.tsx\`. The page auto-updates as you edit the file.

This project uses [\`next/font\`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
        ` + os.EOL
    );
    fs.writeFileSync(
        `${name}/next.config.mjs`,
        `/** @type {import('next').NextConfig} */
const nextConfig = {};
        
export default nextConfig;
        ` + os.EOL
    );

    if (language.value === "typescript") {
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            "@types/node": "^20",
            "@types/react": "^18",
            "@types/react-dom": "^18",
            typescript: "^5",
        };

        fs.writeFileSync(
            `${name}/next-env.d.ts`,
            `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
        ` + os.EOL
        );
        fs.writeFileSync(
            `${name}/tsconfig.json`,
            JSON.stringify(tsConfigJson, null, 2) + os.EOL
        );
    } else if (language.value === "javascript") {
        fs.writeFileSync(
            `${name}/jsconfig.json`,
            JSON.stringify(jsConfigJson, null, 2) + os.EOL
        );
    }

    if (eslint) {
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            eslint: "^8",
            "eslint-config-next": "14.1.0",
        };

        fs.writeFileSync(
            `${name}/.eslintrc.json`,
            `{
    "extends": "next/core-web-vitals"
}
            ` + os.EOL
        );
    }

    if (style.value === "tailwindcss") {
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            autoprefixer: "^10.0.1",
            postcss: "^8",
            tailwindcss: "^3.3.0",
        };

        if (language === "typescript") {
            fs.writeFileSync(
                `${name}/tailwind.config.ts`,
                `import type { Config } from "tailwindcss";

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
                ` + os.EOL
            );
        } else if (language === "javascript") {
            fs.writeFileSync(
                `${name}/tailwind.config.js`,
                `/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./**/*.{js,ts,jsx,tsx,mdx,html}",
        "./src/**/*.{js,ts,jsx,tsx,mdx,html}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
                ` + os.EOL
            );
        }
    } else if (style.value === "scss") {
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            sass: "^1.70.0",
        };
    }

    if (unit) {
        packageJson.scripts.test = "jest --watchAll";
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            "@testing-library/jest-dom": "^6.3.0",
            "@testing-library/react": "^14.1.2",
            jest: "^29.7.0",
            "jest-environment-jsdom": "^29.7.0",
        };

        fs.writeFileSync(
            `${name}/jest.config.js`,
            `const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
    dir: "./",
});

const config = {
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["./jest.setup.js"],
};

module.exports = createJestConfig(config);
            ` + os.EOL
        );

        fs.writeFileSync(
            `${name}/jest.setup.js`,
            `import "@testing-library/jest-dom";
            ` + os.EOL
        );
    }

    if (e2e) {
        packageJson.scripts.e2e = "cypress open";
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            cypress: "^13.6.3",
        };

        fs.writeFileSync(
            `${name}/cypress.config.js`,
            `const { defineConfig } = require('cypress')
 
module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})` + os.EOL
        );
    }

    if (typeof animation !== "string") {
        if (animation.value === "gsap") {
            packageJson.dependencies = {
                ...packageJson.dependencies,
                gsap: "^3.12.4",
                "@gsap/react": "^2.0.2",
            };
        } else if (animation.value === "framer-motion") {
            packageJson.dependencies = {
                ...packageJson.dependencies,
                "framer-motion": "^11.0.3",
            };
        }
    }

    if (typeof ui !== "string") {
        if (ui.value === "mui") {
            packageJson.dependencies = {
                ...packageJson.dependencies,
                "@emotion/react": "^11.11.3",
                "@emotion/styled": "^11.11.0",
                "@mui/material": "^5.15.6",
            };
        } else if (ui.value === "antd") {
            packageJson.dependencies = {
                ...packageJson.dependencies,
                antd: "^5.13.2",
            };
        } else if (ui.value === "shadcn") {
            childProcess.execSync("npx shadcn-ui@latest init", { cwd: name });
        }
    }

    fs.writeFileSync(
        `${name}/package.json`,
        JSON.stringify(packageJson, null, 2) + os.EOL
    );

    fs.mkdirSync(`${name}/public`);
    const isSrc = src ? "src/" : "";

    if (src) {
        fs.mkdirSync(`${name}/src`);
    }

    if (router.value === "app") {
        fs.mkdirSync(`${name}/${isSrc}app`);
        fs.mkdirSync(`${name}/${isSrc}app/(home)`);
        fs.mkdirSync(`${name}/${isSrc}app/(home)/sections`);
        fs.writeFileSync(
            path.join(
                `${name}/${isSrc}app/(home)/sections`,
                `index.${getExtension()}`
            ),
            ""
        );
        if (isTS) {
            fs.writeFileSync(
                `${name}/${isSrc}app/layout.${getExtensionJSX()}`,
                `import "@/styles/main.scss";

import { Providers } from "./providers";
import { Footer, Header } from "@/components/layout";

import type { Metadata } from "next";
import type { RootLayoutProps } from "./types";

export const metadata: Metadata = {
    title: "Create Appx App",
    description: "Generated by create appx app",
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Header />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
                ` + os.EOL
            );
            fs.writeFileSync(
                `${name}/${isSrc}app/providers.${getExtensionJSX()}`,
                `"use client";
import { ProvidersProps } from "./types";

export function Providers({ children }: ProvidersProps) {
    return children;
}
                ` + os.EOL
            );
            fs.writeFileSync(
                `${name}/${isSrc}app/(home)/page.${getExtensionJSX()}`,
                `import "./styles.scss";

export default function HomePage() {
    return <main>HomePage</main>;
}
                ` + os.EOL
            );

            fs.writeFileSync(
                `${name}/${isSrc}app/types.ts`,
                `import type { ReactNode } from "react";

type RootLayoutProps = {
    children: ReactNode;
};

type ProvidersProps = {
    children: ReactNode;
};

export type { RootLayoutProps, ProvidersProps };
                ` + os.EOL
            );
        }
    }

    const appFolders = [
        "components",
        "hooks",
        "utils",
        "context",
        "data",
        "styles",
    ];

    appFolders.forEach((folder) => {
        fs.mkdirSync(`${name}/${isSrc}${folder}`);

        if (!["styles", "components"].includes(folder)) {
            fs.writeFileSync(
                path.join(
                    `${name}/${isSrc}${folder}`,
                    `index.${getExtension()}`
                ),
                ""
            );
        }
    });

    const componentFolders = ["card", "form", "layout", "list", "ui"];

    componentFolders.forEach((folder) => {
        fs.mkdirSync(`${name}/${isSrc}components/${folder}`);
        fs.writeFileSync(
            path.join(
                `${name}/${isSrc}components/${folder}`,
                `index.${getExtension()}`
            ),
            ""
        );

        if (folder === "layout") {
            const layoutFolders = ["Header", "Footer"];

            const layoutContents = {
                Header: `import "./styles.scss";

export function Header() {
    return <header>Header</header>;
}
                `,
                Footer: `import "./styles.scss";

export function Footer() {
    return <footer>Footer</footer>;
}
                `,
            };

            layoutFolders.forEach((layoutFolder) => {
                fs.mkdirSync(
                    `${name}/${isSrc}components/${folder}/${layoutFolder}`
                );

                if (isTS) {
                    fs.writeFileSync(
                        path.join(
                            `${name}/${isSrc}components/${folder}/${layoutFolder}`,
                            `index.${getExtensionJSX()}`
                        ),
                        layoutContents[layoutFolder] + os.EOL
                    );
                }

                if (style.value === "scss") {
                    fs.writeFileSync(
                        path.join(
                            `${name}/${isSrc}components/${folder}/${layoutFolder}`,
                            `styles.scss`
                        ),
                        `@import "mixins", "variables";
                        ` + os.EOL
                    );
                }
            });

            layoutFolders.forEach((folder) => {
                const indexFile = `${name}/${isSrc}components/layout/index.${getExtension()}`;

                if (fs.existsSync(indexFile)) {
                    fs.appendFileSync(
                        indexFile,
                        `export { ${folder} } from './${folder}'` + os.EOL
                    );
                }
            });
        }

        if (folder === "ui") {
            const uiComponentFolders = [
                "AppxGroupSignature",
                "Button",
                "Icons",
                "Section",
            ];

            const uiComponentContents = {
                AppxGroupSignature: `import "./styles.scss";

import { Icons } from "@/components/ui";

export function AppxGroupSignature() {
    return (
        <div className="appx-group__signature">
            <Icons.appxIcon />

            <h4 className="appx-group__signature-title">
                Developed and designed by Appx Group
            </h4>
        </div>
    );
}
                `,
                Button: `"use client";
import "./styles.scss";

import clsx from "clsx";

import type { ButtonProps } from "./types";

export function Button({ children, className, variant, ...rest }: ButtonProps) {
    return (
        <button className={clsx("button", variant, className)} {...rest}>
            {children}
        </button>
    );
}
                `,
                Icons: `import type { IconProps } from "./types";

export const Icons = {};
                `,
                Section: `import "./styles.scss";

import type { SectionProps } from "./types";

export function Section({
    children,
    title,
    description,
    className,
    ...rest
}: SectionProps) {
    return (
        <section className={className} {...rest}>
            <div className="container">
                <div className="section__title-wrapper">
                    <h1 className="section__title">{title}</h1>
                    <p className="section__description">{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}
                `,
            };

            const uiComponentStyles = {
                AppxGroupSignature: `@import "mixins", "variables";

.appx-group__signature {
    @include flex(center, space-between);
    gap: 12px;
    position: relative;
    width: 252px;
    padding: 12px 24px;
    border-radius: 16px;
    backdrop-filter: blur(6px);
    background: rgba(193, 195, 226, 0.16);

    &-title {
        color: $white;
        font-family: var(--font-inter);
        font-size: 12px;
        font-weight: 400;
        line-height: 130%;
    }
}
                `,
                Button: `@import "mixins", "variables";
                `,
                Section: `@import "mixins", "variables";
                `,
            };

            const uiComponentTypes = {
                Button: `import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
};

export type { ButtonProps };
                `,
                Icons: `import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg">;

export type { IconProps };
                `,
                Section: `import type { ComponentProps, ReactNode } from "react";

type SectionProps = ComponentProps<"section"> & {
    children: ReactNode;
    className?: string;
    title?: string;
    description?: string;
};

export type { SectionProps };
                `,
            };

            uiComponentFolders.forEach((uiComponentFolder) => {
                fs.mkdirSync(
                    `${name}/${isSrc}components/${folder}/${uiComponentFolder}`
                );
                fs.writeFileSync(
                    path.join(
                        `${name}/${isSrc}components/${folder}/${uiComponentFolder}`,
                        `index.${getExtensionJSX()}`
                    ),
                    uiComponentContents[uiComponentFolder] + os.EOL
                );

                if (uiComponentFolder !== "Icons") {
                    fs.writeFileSync(
                        `${name}/${isSrc}components/${folder}/${uiComponentFolder}/styles.scss`,
                        uiComponentStyles[uiComponentFolder] + os.EOL
                    );
                }

                if (uiComponentFolder !== "AppxGroupSignature" && isTS) {
                    fs.writeFileSync(
                        `${name}/${isSrc}components/${folder}/${uiComponentFolder}/types.ts`,
                        uiComponentTypes[uiComponentFolder] + os.EOL
                    );
                }
            });

            uiComponentFolders.forEach((uiComponentFolder) => {
                const indexFile = `${name}/${isSrc}components/ui/index.${getExtension()}`;

                if (fs.existsSync(indexFile)) {
                    fs.appendFileSync(
                        indexFile,
                        `export { ${uiComponentFolder} } from './${uiComponentFolder}'` +
                            os.EOL
                    );
                }
            });
        }
    });

    if (style.value === "css") {
        fs.writeFileSync(
            `${name}/${isSrc}styles/main.css`,
            `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html,
body {
    width: 100%;
    height: 100%;
}

body {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    position: relative;

    main {
        flex: 1 1 auto;
    }
}

a {
    font: inherit;
    color: inherit;
    text-decoration: none;
}

ul,
ol,
li {
    font: inherit;
    color: inherit;
    list-style: none;
}

input,
button,
textarea {
    border: none;
    outline: none;
    background-color: transparent;
}

textarea {
    resize: none;
}

button {
    cursor: pointer;
}

.container {
    width: 100%;
    max-width: unset;
    margin-inline: auto;
    padding-inline: unset;
}
            ` + os.EOL
        );
    } else if (style.value === "scss") {
        fs.mkdirSync(`${name}/${isSrc}styles/globals`);
        fs.writeFileSync(
            `${name}/${isSrc}styles/globals/_mixins.scss`,
            `@mixin flex($align: flex-start, $justify: flex-start) {
    display: flex;
    align-items: $align;
    justify-content: $justify;
}

$maxWidth: 1920;
$maxWidthContainer: 1440;
@mixin adaptive-value($property, $startSize, $minSize) {
    $addSize: $startSize - $minSize;

    #{$property}: $startSize + px;
    @media (max-width:#{$maxWidthContainer + px}) {
        #{$property}: calc(
            #{$minSize + px} + #{$addSize} *
                ((100vw - 320px) / #{$maxWidthContainer - 320})
        );
    }
}

@mixin any-hover() {
    @media only screen and (any-hover: hover) {
        &:hover {
            @content;
        }
    }
}

@mixin media($breakpoint, $query: max-width) {
    @media only screen and ($query: #{$breakpoint}px) {
        @content;
    }
}
            ` + os.EOL
        );
        fs.writeFileSync(
            `${name}/${isSrc}styles/globals/_normalizers.scss`,
            `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html,
body {
    width: 100%;
    height: 100%;
}

body {
    @include flex(flex-start, space-between);
    flex-direction: column;
    position: relative;

    & > main {
        flex: 1 1 auto;
    }
}

a {
    font: inherit;
    color: inherit;
    text-decoration: none;
}

ul,
ol,
li {
    font: inherit;
    color: inherit;
    list-style: none;
}

input,
button,
textarea {
    border: none;
    outline: none;
    background-color: transparent;
}

textarea {
    resize: none;
}

button {
    cursor: pointer;
}

.container {
    width: 100%;
    max-width: unset;
    margin-inline: auto;
    padding-inline: unset;
}
            ` + os.EOL
        );
        fs.writeFileSync(
            `${name}/${isSrc}styles/globals/_variables.scss`,
            `// colors
            ` + os.EOL
        );
        fs.writeFileSync(
            `${name}/${isSrc}styles/main.scss`,
            `@import "./globals/variables", "./globals/mixins", "./globals/normalizers";
            ` + os.EOL
        );
    } else if (style.value === "tailwindcss") {
        fs.writeFileSync(
            `${name}/${isSrc}styles/main.css`,
            `@tailwind base;
@tailwind utilities;
@tailwind components;

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html,
body {
    width: 100%;
    height: 100%;
}

body {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    position: relative;

    main {
        flex: 1 1 auto;
    }
}

a {
    font: inherit;
    color: inherit;
    text-decoration: none;
}

ul,
ol,
li {
    font: inherit;
    color: inherit;
    list-style: none;
}

input,
button,
textarea {
    border: none;
    outline: none;
    background-color: transparent;
}

textarea {
    resize: none;
}

button {
    cursor: pointer;
}

.container {
    width: 100%;
    max-width: unset;
    margin-inline: auto;
    padding-inline: unset;
}
            ` + os.EOL
        );
    }

    console.log(yellow("\n| Installing packages..."));
    if (packageManager === "npm") {
        childProcess.execSync(`npm install`, {
            cwd: [".", "./"].includes(name) ? "" : name,
        });
    } else if (packageManager === "yarn") {
        childProcess.execSync(`yarn`, {
            cwd: [".", "./"].includes(name) ? "" : name,
        });
    } else if (packageManager === "pnpm") {
        childProcess.execSync(`pnpm install`, {
            cwd: [".", "./"].includes(name) ? "" : name,
        });
    } else if (packageManager === "bun") {
        childProcess.execSync(`bun install`, {
            cwd: [".", "./"].includes(name) ? "" : name,
        });
    }
}

async function projectName() {
    const { name } = await prompts({
        type: "text",
        name: "name",
        initial: defaultPreferences.name,
        message: "What is your project name?",
    });

    userPreferences.name = name;
}

async function preferredLanguage() {
    const { language } = await prompts({
        type: "select",
        name: "language",
        message: `What is your preferred language? ${gray(
            `default: ${defaultPreferences.language.title}`
        )}`,
        choices: [
            {
                title: "Typescript",
                value: "typescript",
            },
            {
                title: "Javascript",
                value: "javascript",
            },
        ],
    });

    const choosedLanguage = {
        title: `${language[0].toUpperCase()}${language.slice(1)}`,
        value: language,
    };
    userPreferences.language = choosedLanguage;
}

async function stylingOptions() {
    const { style } = await prompts({
        type: "select",
        name: "style",
        message: `Choose your styling option? ${gray(
            `default: ${defaultPreferences.style.title}`
        )}`,
        choices: [
            {
                title: "CSS",
                value: "css",
            },
            {
                title: "SCSS",
                value: "scss",
            },
            {
                title: "Tailwindcss",
                value: "tailwindcss",
            },
            {
                title: "Styled Components",
                value: "styled-components",
            },
        ],
    });

    const choosedStyle = {
        title: ["css", "scss"].includes(style)
            ? style.toUpperCase()
            : `${style[0].toUpperCase()}${style.slice(1)}`.replace("-", " "),
        value: style,
    };
    userPreferences.style = choosedStyle;
}

async function eslint() {
    const { eslint } = await prompts({
        type: "confirm",
        name: "eslint",
        initial: defaultPreferences.eslint,
        message: "Do you want to use ESLint?",
    });

    userPreferences.eslint = eslint;
}

async function src() {
    const { src } = await prompts({
        type: "confirm",
        name: "src",
        initial: defaultPreferences.src,
        message: "Do you want to use src/ directory?",
    });

    userPreferences.src = src;
}

async function router() {
    const { router } = await prompts({
        type: "select",
        name: "router",
        message: `What is your preferred router? ${gray(
            `default: ${defaultPreferences.router.title}`
        )}`,
        choices: [
            {
                title: "App router",
                value: "app",
            },
            {
                title: "Page router",
                value: "page",
            },
        ],
    });

    const choosedRouter = {
        title: `${router[0].toUpperCase()} router`,
        value: router,
    };
    userPreferences.router = choosedRouter;
}

async function unit() {
    const { unit } = await prompts({
        type: "confirm",
        name: "unit",
        initial: defaultPreferences.unit,
        message: "Do you want to use unit testing?",
    });

    userPreferences.unit = unit;
}

async function e2e() {
    const { e2e } = await prompts({
        type: "confirm",
        name: "e2e",
        initial: defaultPreferences.e2e,
        message: "Do you want to use e2e testing?",
    });

    userPreferences.e2e = e2e;
}

async function ui() {
    const { ui } = await prompts({
        name: "ui",
        type: "select",
        message: `What is your preferred UI library? ${gray(
            `default: ${defaultPreferences.ui}`
        )}`,
        choices: [
            {
                title: "I don't want to use any UI library",
                value: "none",
            },
            {
                title: "Material UI",
                value: "mui",
            },
            {
                title: "Ant Design",
                value: "antd",
            },
            {
                title: "Shadcn UI",
                value: "shadcn",
            },
        ],
    });

    userPreferences.ui = ui;
}

async function animation() {
    const { animation } = await prompts({
        type: "select",
        name: "animation",
        message: `What is your preferred animation library? ${gray(
            `default: ${defaultPreferences.animation}`
        )}`,
        choices: [
            {
                title: "I don't want to use any animation library",
                value: "none",
            },
            {
                title: "GSAP",
                value: "gsap",
            },
            {
                title: "Framer Motion",
                value: "framer-motion",
            },
        ],
    });

    userPreferences.animation = animation;
}

async function packageManager() {
    const { packageManager } = await prompts({
        type: "select",
        name: "packageManager",
        message: `Choose package manager to work with ${gray(
            `default: ${defaultPreferences.packageManager}`
        )}`,
        choices: [
            {
                title: "npm",
                value: "npm",
            },
            {
                title: "yarn",
                value: "yarn",
            },
            {
                title: "pnpm",
                value: "pnpm",
            },
            {
                title: "bun",
                value: "bun",
            },
        ],
    });

    userPreferences.packageManager = packageManager;
}

async function confirmAlias() {
    const { alias } = await prompts({
        type: "toggle",
        name: "alias",
        initial: defaultPreferences.alias,
        message: `Do you want to costomize an import alias? ${gray(
            `default: ${defaultPreferences.alias}`
        )}`,
        active: "yes",
        inactive: "no",
    });

    if (alias) {
        await importAlias();
    } else {
        userPreferences.alias = defaultPreferences.alias;
    }
}

async function importAlias() {
    const validAlias = /^(!|@|#|\$|%|\^|&)\/?\*?$/;

    const { alias } = await prompts({
        type: "text",
        name: "alias",
        initial: defaultPreferences.alias,
        message: "What is your import alias?",
    });

    if (alias.match(validAlias)) {
        userPreferences.alias = alias;
    } else {
        console.error(red("Error: Invalid import alias!"));
        process.exit(1);
    }
}

async function done() {
    const glitchMessage = chalkAnimation.glitch(
        `
        Project created successfully!
        Happy Hacking!
        `
    );

    await sleep(4000);
    glitchMessage.stop();
    console.clear();
}

if (typeof program.args[0] === "string") {
    if (
        ![".", "./"].includes(program.args[0]) &&
        fs.existsSync(defaultPreferences.name)
    ) {
        console.error(red("\n Error: Directory already exists!"));
        process.exit(1);
    }
} else {
    await projectName();
}

if (typeof program.typescript !== "undefined") {
    userPreferences.language = {
        title: "Typescript",
        value: "typescript",
    };
} else if (typeof program.javascript !== "undefined") {
    userPreferences.language = {
        title: "Javascript",
        value: "javascript",
    };
} else {
    await preferredLanguage();
}

if (typeof program.scss !== "undefined") {
    userPreferences.style = {
        title: "SCSS",
        value: "scss",
    };
} else if (typeof program.css !== "undefined") {
    userPreferences.style = {
        title: "CSS",
        value: "css",
    };
} else if (typeof program.tailwindcss !== "undefined") {
    userPreferences.style = {
        title: "Tailwind",
        value: "tailwindcss",
    };
} else if (typeof program.styledComponents !== "undefined") {
    userPreferences.style = {
        title: "Styled Components",
        value: "styled-components",
    };
} else {
    await stylingOptions();
}

if (typeof program.eslint !== "undefined") {
    userPreferences.eslint = program.eslint;
} else {
    await eslint();
}

if (typeof program.src !== "undefined") {
    userPreferences.src = program.src;
} else {
    await src();
}

if (typeof program.app !== "undefined") {
    userPreferences.router = {
        title: "App router",
        value: "app",
    };
} else if (typeof program.page !== "undefined") {
    userPreferences.router = {
        title: "Page router",
        value: "page",
    };
} else {
    await router();
}

if (typeof program.unit !== "undefined") {
    userPreferences.unit = program.unit;
} else {
    await unit();
}

if (typeof program.e2e !== "undefined") {
    userPreferences.e2e = program.e2e;
} else {
    await e2e();
}

await ui();

if (typeof program.gsap !== "undefined") {
    userPreferences.animation = {
        title: "GSAP",
        value: "gsap",
    };
} else if (typeof program.framerMotion !== "undefined") {
    userPreferences.animation = {
        title: "Framer Motion",
        value: "framer-motion",
    };
} else {
    await animation();
}

if (typeof program.useYarn !== "undefined") {
    userPreferences.packageManager = "yarn";
} else if (typeof program.useNpm !== "undefined") {
    userPreferences.packageManager = "pnpm";
} else if (typeof program.usePnpm !== "undefined") {
    userPreferences.packageManager = "npm";
} else if (typeof program.useBun !== "undefined") {
    userPreferences.packageManager = "bun";
} else {
    await packageManager();
}

await confirmAlias();
await createAppxApp();
await done();
