import "./styles.scss";

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
