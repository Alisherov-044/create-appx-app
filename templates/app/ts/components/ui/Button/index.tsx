"use client";
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
