import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
};

export type { ButtonProps };
