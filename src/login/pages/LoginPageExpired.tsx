import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { Check, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={null}>
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>{msg("pageExpiredTitle")}</EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                    <Button asChild size="sm">
                        <a id="backToApplication" href={url.loginRestartFlowUrl}>
                            <Undo2 />
                            {msg("pageExpiredMsg1")}
                        </a>
                    </Button>
                    <Button asChild size="sm" variant="secondary">
                        <a id="backToApplication" href={url.loginAction}>
                            <Check />
                            {msg("pageExpiredMsg2")}
                        </a>
                    </Button>
                </EmptyContent>
            </Empty>
        </Template>
    );
}
