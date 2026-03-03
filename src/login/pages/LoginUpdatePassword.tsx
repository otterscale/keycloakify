import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Logo } from "@/components/svg/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import "../../index.css";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg, msgStr } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    const [logoutSessions, setLogoutSessions] = useState(true);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={null}
        >
            <form id="kc-passwd-update-form" action={url.loginAction} method="post">
                <FieldGroup>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <a href="https://otterscale.io" className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex h-8 items-center justify-center rounded-md">
                                <Logo className="size-56" />
                            </div>
                            <span className="sr-only">OtterScale</span>
                        </a>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="password-new">{msg("passwordNew")}</FieldLabel>
                        <Input
                            id="password-new"
                            name="password-new"
                            type="password"
                            autoFocus
                            autoComplete="new-password"
                            aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                        />
                        {messagesPerField.existsError("password") && (
                            <FieldError>
                                <span
                                    id="input-error-password"
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("password"))
                                    }}
                                />
                            </FieldError>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password-confirm">{msg("passwordConfirm")}</FieldLabel>
                        <Input
                            id="password-confirm"
                            name="password-confirm"
                            type="password"
                            autoComplete="new-password"
                            aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                        />
                        {messagesPerField.existsError("password-confirm") && (
                            <FieldError>
                                <span
                                    id="input-error-password-confirm"
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("password-confirm"))
                                    }}
                                />
                            </FieldError>
                        )}
                    </Field>

                    <Field orientation="horizontal">
                        <Checkbox
                            id="logout-sessions"
                            name="logout-sessions"
                            value="on"
                            checked={logoutSessions}
                            onCheckedChange={checked => setLogoutSessions(checked === true)}
                        />
                        <FieldLabel htmlFor="logout-sessions">{msg("logoutOtherSessions")}</FieldLabel>
                    </Field>

                    <Field className="flex gap-4">
                        <Button type="submit">{msgStr("doSubmit")}</Button>
                        {isAppInitiatedAction && (
                            <Button variant="secondary" type="submit" name="cancel-aia" value="true">
                                {msg("doCancel")}
                            </Button>
                        )}
                    </Field>
                </FieldGroup>
            </form>
        </Template>
    );
}
