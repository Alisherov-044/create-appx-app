#!/usr/bin/env node

import os from "os";
import fs from "fs";
import path from "path";
import figlet from "figlet";
import pkg from "picocolors";
import prompts from "prompts";
import Commander from "commander";
import { Spinner } from "cli-spinner";
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
    .version("1.0.0")
    .arguments("<project-directory")
    .usage(`${green("<project-directory>")} [options]`)
    .action((name) => {
        if (typeof name === "string") {
            defaultPreferences.name = name;
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

const spinner = new Spinner({
    text: yellow("Installing packages..."),
    stream: process.stderr,
});

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

    fs.mkdir(`${name}`, { recursive: true }, (err) => {
        if (err) {
            console.error(red(err));
        }
    });

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
        fs.readFileSync("./examples/.prettierrc")
    );
    fs.writeFileSync(
        `${name}/.gitignore`,
        fs.readFileSync("./examples/.gitignore")
    );
    fs.writeFileSync(
        `${name}/README.md`,
        fs.readFileSync("./examples/README.md")
    );
    fs.writeFileSync(
        `${name}/next.config.mjs`,
        fs.readFileSync("./examples/next.config.mjs")
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
            fs.readFileSync("./examples/next-env.d.ts")
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
            fs.readFileSync("./examples/.eslintrc.json")
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
                fs.readFileSync("./examples/tailwind.config.ts")
            );
        } else if (language === "javascript") {
            fs.writeFileSync(
                `${name}/tailwind.config.js`,
                fs.readFileSync("./examples/tailwind.config.js")
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
            fs.readFileSync("./examples/jest.config.js")
        );

        fs.writeFileSync(
            `${name}/jest.setup.js`,
            fs.readFileSync("./examples/jest.setup.js")
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
            fs.readFileSync("./examples/cypress.config.js")
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
        fs.writeFileSync(
            `${name}/${isSrc}app/layout.${getExtensionJSX()}`,
            fs.readFileSync(
                `./templates/app/${
                    isTS ? "ts" : "js"
                }/app/layout.${getExtensionJSX()}`
            )
        );
        fs.writeFileSync(
            `${name}/${isSrc}app/providers.${getExtensionJSX()}`,
            fs.readFileSync(
                `./templates/app/${
                    isTS ? "ts" : "js"
                }/app/providers.${getExtensionJSX()}`
            )
        );
        fs.writeFileSync(
            `${name}/${isSrc}app/(home)/page.${getExtensionJSX()}`,
            fs.readFileSync(
                `./templates/app/${
                    isTS ? "ts" : "js"
                }/app/(home)/page.${getExtensionJSX()}`
            )
        );

        if (isTS) {
            fs.writeFileSync(
                `${name}/${isSrc}app/types.ts`,
                fs.readFileSync(`./templates/app/ts/app/types.ts`)
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

            layoutFolders.forEach((layoutFolder) => {
                fs.mkdirSync(
                    `${name}/${isSrc}components/${folder}/${layoutFolder}`
                );

                fs.writeFileSync(
                    path.join(
                        `${name}/${isSrc}components/${folder}/${layoutFolder}`,
                        `index.${getExtensionJSX()}`
                    ),
                    fs.readFileSync(
                        `./templates/app/${
                            isTS ? "ts" : "js"
                        }/components/layout/${layoutFolder}/index.${getExtensionJSX()}`
                    )
                );

                if (style.value === "scss") {
                    fs.writeFileSync(
                        path.join(
                            `${name}/${isSrc}components/${folder}/${layoutFolder}`,
                            `styles.scss`
                        ),
                        fs.readFileSync(
                            `./templates/app/ts/components/layout/${layoutFolder}/styles.scss`
                        )
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

            uiComponentFolders.forEach((uiComponentFolder) => {
                fs.mkdirSync(
                    `${name}/${isSrc}components/${folder}/${uiComponentFolder}`
                );
                fs.writeFileSync(
                    path.join(
                        `${name}/${isSrc}components/${folder}/${uiComponentFolder}`,
                        `index.${getExtensionJSX()}`
                    ),
                    fs.readFileSync(
                        `./templates/app/${
                            isTS ? "ts" : "js"
                        }/components/ui/${uiComponentFolder}/index.${getExtensionJSX()}`
                    )
                );

                const stylesPath = `./templates/app/${
                    isTS ? "ts" : "js"
                }/components/ui/${uiComponentFolder}/styles.scss`;
                const typesPath = `./templates/app/ts/components/ui/${uiComponentFolder}/types.ts`;

                if (fs.existsSync(stylesPath) && style.value === "scss") {
                    fs.writeFileSync(
                        `${name}/${isSrc}components/${folder}/${uiComponentFolder}/styles.scss`,
                        fs.readFileSync(stylesPath)
                    );
                }

                if (fs.existsSync(typesPath) && isTS) {
                    fs.writeFileSync(
                        `${name}/${isSrc}components/${folder}/${uiComponentFolder}/types.ts`,
                        fs.readFileSync(typesPath)
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
            fs.readFileSync(
                `./templates/app/${isTS ? "ts" : "js"}/styles/css/main.css`
            )
        );
    } else if (style.value === "scss") {
        fs.mkdirSync(`${name}/${isSrc}styles/globals`);
        fs.writeFileSync(
            `${name}/${isSrc}styles/globals/_mixins.scss`,
            fs.readFileSync(
                `./templates/app/${
                    isTS ? "ts" : "js"
                }/styles/scss/globals/_mixins.scss`
            )
        );
        fs.writeFileSync(
            `${name}/${isSrc}styles/globals/_normalizers.scss`,
            fs.readFileSync(
                `./templates/app/${
                    isTS ? "ts" : "js"
                }/styles/scss/globals/_normalizers.scss`
            )
        );
        fs.writeFileSync(
            `${name}/${isSrc}styles/globals/_variables.scss`,
            fs.readFileSync(
                `./templates/app/${
                    isTS ? "ts" : "js"
                }/styles/scss/globals/_variables.scss`
            )
        );
        fs.writeFileSync(
            `${name}/${isSrc}styles/main.scss`,
            fs.readFileSync(
                `./templates/app/${isTS ? "ts" : "js"}/styles/scss/main.scss`
            )
        );
    } else if (style.value === "tailwindcss") {
        fs.writeFileSync(
            `${name}/${isSrc}styles/main.css`,
            fs.readFileSync(
                `./templates/app/${
                    isTS ? "ts" : "js"
                }/styles/tailwindcss/main.css`
            )
        );
    }

    console.log("\n");
    spinner.start();
    if (packageManager === "npm") {
        childProcess.execSync(`npm install`, { cwd: name });
    } else if (packageManager === "yarn") {
        childProcess.execSync(`yarn`, { cwd: name });
    } else if (packageManager === "pnpm") {
        childProcess.execSync(`pnpm install`, { cwd: name });
    } else if (packageManager === "bun") {
        childProcess.execSync(`bun install`, { cwd: name });
    }
}

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow(
        figlet.textSync("create-appx-app", {
            horizontalLayout: "default",
        })
    );

    await sleep();
    rainbowTitle.stop();
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
    spinner.stop();

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

await welcome();

if (typeof program.args[0] === "string") {
    if (fs.existsSync(defaultPreferences.name)) {
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
