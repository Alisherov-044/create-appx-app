import type { ComponentProps, ReactNode } from "react";

type SectionProps = ComponentProps<"section"> & {
    children: ReactNode;
    className?: string;
    title?: string;
    description?: string;
};

export type { SectionProps };
