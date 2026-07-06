import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { Check, Undo2 } from "lucide-react";
import { RealmLogo } from "@/components/realm-logo";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";

import "../../index.css";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={null}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-4 text-center">
                    <a /* href="https://otterscale.io" */ className="flex flex-col items-center gap-2 font-medium">
                        <div className="flex h-8 items-center justify-center rounded-md">
                            <RealmLogo displayNameHtml={realm.displayNameHtml} className="size-56" />
                        </div>
                        <span className="sr-only">OtterScale</span>
                    </a>
                    <h1 className="text-xl font-semibold">{msg("pageExpiredTitle")}</h1>
                </div>
                <Field className="flex gap-4">
                    <Button asChild>
                        <a id="loginRestartLink" href={url.loginRestartFlowUrl}>
                            <Undo2 />
                            {msg("pageExpiredMsg1")}
                        </a>
                    </Button>
                    <Button asChild variant="secondary">
                        <a id="loginContinueLink" href={url.loginAction}>
                            <Check />
                            {msg("pageExpiredMsg2")}
                        </a>
                    </Button>
                </Field>
            </FieldGroup>
        </Template>
    );
}
