import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/svg/logo";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";

import "../../index.css";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client, skipLink } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
            <div id="kc-error-message">
                <FieldGroup>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <a href="https://otterscale.io" className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex h-8 items-center justify-center rounded-md">
                                <Logo className="size-56" />
                            </div>
                            <span className="sr-only">OtterScale</span>
                        </a>
                        <h1 className="text-xl font-semibold">{msg("errorTitle")}</h1>
                        <FieldDescription>
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                        </FieldDescription>
                    </div>
                    {!skipLink && client !== undefined && client.baseUrl !== undefined && (
                        <Field>
                            <Button asChild>
                                <a id="backToApplication" href={client.baseUrl}>
                                    <ChevronLeft />
                                    {msgStr("backToApplication").replace(/&laquo;/g, "")}
                                </a>
                            </Button>
                        </Field>
                    )}
                </FieldGroup>
            </div>
        </Template>
    );
}
