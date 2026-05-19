import { kcSanitize } from "keycloakify/lib/kcSanitize";

import { Logo } from "@/components/svg/logo";
import { cn } from "@/lib/utils";

interface RealmLogoProps {
    displayNameHtml?: string;
    className?: string;
}

export function RealmLogo({ displayNameHtml, className }: RealmLogoProps) {
    if (!displayNameHtml) {
        return <Logo className={className} />;
    }
    return (
        <div
            className={cn(
                "flex items-center justify-center overflow-hidden",
                "[&_img]:size-full [&_img]:object-contain [&_svg]:size-full",
                className
            )}
            dangerouslySetInnerHTML={{ __html: kcSanitize(displayNameHtml) }}
        />
    );
}
