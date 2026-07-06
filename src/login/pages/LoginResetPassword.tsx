import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { RealmLogo } from "@/components/realm-logo";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import "../../index.css";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username")}
            headerNode={null}
        >
            <form id="kc-reset-password-form" action={url.loginAction} method="post">
                <FieldGroup>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <a /* href="https://otterscale.io" */ className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex h-8 items-center justify-center rounded-md">
                                <RealmLogo displayNameHtml={realm.displayNameHtml} className="size-56" />
                            </div>
                            <span className="sr-only">OtterScale</span>
                        </a>
                        <FieldDescription>{msg("emailForgotTitle")} </FieldDescription>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="username">
                            {!realm.loginWithEmailAllowed
                                ? msg("username")
                                : !realm.registrationEmailAsUsername
                                  ? msg("usernameOrEmail")
                                  : msg("email")}
                        </FieldLabel>
                        <Input
                            id="username"
                            name="username"
                            defaultValue={auth.attemptedUsername ?? ""}
                            type="text"
                            autoFocus
                            autoComplete="off"
                            aria-invalid={messagesPerField.existsError("username")}
                        />
                        <FieldDescription>
                            {realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
                        </FieldDescription>
                        {messagesPerField.existsError("username") && (
                            <FieldError>
                                <span
                                    id="input-error-username"
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("username"))
                                    }}
                                />
                            </FieldError>
                        )}
                    </Field>

                    <Field className="flex gap-4">
                        <Button type="submit">{msgStr("doSubmit")}</Button>
                        <Button variant={"secondary"} asChild>
                            <a href={url.loginUrl}>{msgStr("backToLogin").replace(/&laquo;/g, "")}</a>
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </Template>
    );
}
