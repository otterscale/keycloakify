import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client, skipLink } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
            <div id="kc-error-message">
                <Empty>
                    <EmptyHeader>
                        <EmptyTitle>{msg("errorTitle")}</EmptyTitle>
                        <EmptyDescription>
                            <p className="instruction" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                        </EmptyDescription>
                    </EmptyHeader>
                    {!skipLink && client !== undefined && client.baseUrl !== undefined && (
                        <EmptyContent>
                            <Button asChild size="sm">
                                <a id="backToApplication" href={client.baseUrl}>
                                    <ChevronLeft />
                                    {msgStr("backToApplication").replace(/&laquo;/g, "")}
                                </a>
                            </Button>
                        </EmptyContent>
                    )}
                </Empty>
            </div>
        </Template>
    );
}
