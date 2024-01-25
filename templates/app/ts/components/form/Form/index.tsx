import type { FormProps } from "./types";

export function Form({ children, className, onSubmit }: FormProps) {
    return (
        <form className={className} onSubmit={onSubmit}>
            {children}
        </form>
    );
}
