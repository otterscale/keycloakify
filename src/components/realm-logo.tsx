import { kcSanitize } from "keycloakify/lib/kcSanitize";

import { Logo } from "@/components/svg/logo";
import { cn } from "@/lib/utils";

interface RealmLogoProps {
    displayNameHtml?: string;
    className?: string;
}

// When the realm logo text is exactly the brand name, show the built-in SVG
// logo instead of rendering it as plain text. Note: Keycloak already falls back
// realm.displayNameHtml to realm.displayName when the "HTML Display name" field
// is blank, so a blank field arrives here as the realm's display name.
const BRAND_NAME = "OtterScale";

function containsMarkup(value: string): boolean {
    return /<[a-z][\s\S]*>/i.test(value);
}

export function RealmLogo({ displayNameHtml, className }: RealmLogoProps) {
    const value = displayNameHtml?.trim() ?? "";

    // Empty, or exactly the brand name -> built-in SVG logo.
    if (!value || value.toLowerCase() === BRAND_NAME.toLowerCase()) {
        return <Logo className={className} />;
    }

    // Contains HTML markup (e.g. <img>, <svg>, <span>) -> render it as the logo.
    if (containsMarkup(value)) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center overflow-hidden",
                    "[&_img]:size-full [&_img]:object-contain [&_svg]:size-full",
                    className
                )}
                dangerouslySetInnerHTML={{ __html: kcSanitize(value) }}
            />
        );
    }

    // Plain text -> render the text as the logo.
    return (
        <div className={cn("flex items-center justify-center", className)}>
            <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
        </div>
    );
}
