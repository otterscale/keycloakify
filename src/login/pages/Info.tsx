import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { advancedMsgStr, msgStr } = i18n;

    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
            <div id="kc-info-message">
                <Empty>
                    <EmptyHeader>
                        <EmptyTitle>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messageHeader ? advancedMsgStr(messageHeader) : message.summary)
                                }}
                            />
                        </EmptyTitle>
                        <EmptyDescription>
                            <p
                                className="instruction"
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
                        </EmptyDescription>
                    </EmptyHeader>

                    {(() => {
                        if (skipLink) {
                            return null;
                        }

                        if (pageRedirectUri) {
                            return (
                                <EmptyContent>
                                    <Button asChild size="sm">
                                        <a href={pageRedirectUri}>
                                            <ChevronLeft />
                                            {msgStr("backToApplication").replace(/&laquo;/g, "")}
                                        </a>
                                    </Button>
                                </EmptyContent>
                            );
                        }

                        if (actionUri) {
                            return (
                                <EmptyContent>
                                    <Button asChild size="sm">
                                        <a href={actionUri}>
                                            <Check />
                                            {msgStr("proceedWithAction").replace(/&raquo;/g, "")}
                                        </a>
                                    </Button>
                                </EmptyContent>
                            );
                        }

                        if (client.baseUrl) {
                            return (
                                <EmptyContent>
                                    <Button asChild size="sm">
                                        <a href={client.baseUrl}>
                                            <ChevronLeft />
                                            {msgStr("backToApplication").replace(/&laquo;/g, "")}
                                        </a>
                                    </Button>
                                </EmptyContent>
                            );
                        }
                    })()}
                </Empty>
            </div>
        </Template>
    );
}
