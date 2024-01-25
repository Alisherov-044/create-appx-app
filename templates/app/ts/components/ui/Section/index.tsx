import "./styles.scss";

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
