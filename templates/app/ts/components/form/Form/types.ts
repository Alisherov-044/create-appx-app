import type { ReactNode } from "react";

type FormProps = {
    children: ReactNode;
    className?: string;
    onSubmit: () => void;
};

export type { FormProps };
