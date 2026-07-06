import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { Check, ChevronLeft } from "lucide-react";
import { RealmLogo } from "@/components/realm-logo";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";

import "../../index.css";

export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { advancedMsgStr, msgStr } = i18n;

    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client, realm } = kcContext;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
            <div id="kc-info-message">
                <FieldGroup>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <a /* href="https://otterscale.io" */ className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex h-8 items-center justify-center rounded-md">
                                <RealmLogo displayNameHtml={realm.displayNameHtml} className="size-56" />
                            </div>
                            <span className="sr-only">OtterScale</span>
                        </a>
                        <h1 className="text-xl font-semibold">
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messageHeader ? advancedMsgStr(messageHeader) : message.summary)
                                }}
                            />
                        </h1>
                        <FieldDescription>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(
                                        (() => {
                                            let html = message.summary?.trim();

                                            if (requiredActions) {
                                                html += " <b>";

                                                html += requiredActions
                                                    .map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`))
                                                    .join(", ");

                                                html += "</b>";
                                            }

                                            return html;
                                        })()
                                    )
                                }}
                            />
                        </FieldDescription>
                    </div>

                    {(() => {
                        if (skipLink) {
                            return null;
                        }

                        if (pageRedirectUri) {
                            return (
                                <Field>
                                    <Button asChild>
                                        <a href={pageRedirectUri}>
                                            <ChevronLeft />
                                            {msgStr("backToApplication").replace(/&laquo;/g, "")}
                                        </a>
                                    </Button>
                                </Field>
                            );
                        }

                        if (actionUri) {
                            return (
                                <Field>
                                    <Button asChild>
                                        <a href={actionUri}>
                                            <Check />
                                            {msgStr("proceedWithAction").replace(/&raquo;/g, "")}
                                        </a>
                                    </Button>
                                </Field>
                            );
                        }

                        if (client.baseUrl) {
                            return (
                                <Field>
                                    <Button asChild>
                                        <a href={client.baseUrl}>
                                            <ChevronLeft />
                                            {msgStr("backToApplication").replace(/&laquo;/g, "")}
                                        </a>
                                    </Button>
                                </Field>
                            );
                        }
                    })()}
                </FieldGroup>
            </div>
        </Template>
    );
}
