/**
 * Password step (login-password.ftl) for flows where username is already captured.
 * Adds conditional WebAuthn passkey authenticate section when enabled.
 */
import { useState } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginPassword.useScript";
import { Logo } from "@/components/svg/logo";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import "../../index.css";

export default function LoginPassword(props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { realm, auth, url, messagesPerField, enableWebAuthnConditionalUI, authenticators } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const webAuthnButtonId = "authenticateWebAuthnButton";

    useScript({
        webAuthnButtonId,
        kcContext,
        i18n
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={null}
            displayMessage={!messagesPerField.existsError("password")}
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    <form
                        id="kc-form-login"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                    >
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <a href="https://otterscale.com" className="flex flex-col items-center gap-2 font-medium">
                                    <div className="flex h-8 items-center justify-center rounded-md">
                                        <Logo className="size-16 stroke-2" />
                                    </div>
                                    <span className="sr-only">OtterScale</span>
                                </a>
                                {auth !== undefined && auth.attemptedUsername && (
                                    <FieldDescription className="flex items-center gap-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="size-4 lucide lucide-user-round-check-icon lucide-user-round-check"
                                        >
                                            <path d="M2 21a8 8 0 0 1 13.292-6" />
                                            <circle cx="10" cy="8" r="5" />
                                            <path d="m16 19 2 2 4-4" className="text-green-600" />
                                        </svg>
                                        {auth.attemptedUsername}
                                    </FieldDescription>
                                )}
                            </div>
                            <Field>
                                <FieldLabel htmlFor="password">{msg("password")}</FieldLabel>
                                <Input
                                    tabIndex={2}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoFocus
                                    autoComplete="on"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                />
                                {messagesPerField.existsError("password") && <FieldError>{messagesPerField.getFirstError("password")}</FieldError>}
                                {realm.resetPasswordAllowed && (
                                    <FieldDescription>
                                        <span>
                                            <a
                                                tabIndex={5}
                                                href={url.loginResetCredentialsUrl}
                                                className="text-xs text-muted-foreground hover:underline"
                                            >
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    </FieldDescription>
                                )}
                            </Field>
                            <Field className="flex gap-4">
                                <Button tabIndex={4} disabled={isLoginButtonDisabled} name="login" id="kc-login" type="submit">
                                    {msgStr("doLogIn")}
                                </Button>
                                {auth !== undefined && auth.showUsername && !auth.showResetCredentials && (
                                    <Button variant={"secondary"} asChild>
                                        <a href={url.loginRestartFlowUrl}>{msgStr("restartLoginTooltip")}</a>
                                    </Button>
                                )}
                            </Field>
                        </FieldGroup>
                    </form>
                </div>
            </div>
            {enableWebAuthnConditionalUI && (
                <>
                    <FieldGroup className="pt-6">
                        <Field>
                            <Button variant={"secondary"} id={webAuthnButtonId}>
                                {msgStr("passkey-doAuthenticate")}
                            </Button>
                        </Field>

                        <form id="webauth" action={url.loginAction} method="post">
                            <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                            <input type="hidden" id="authenticatorData" name="authenticatorData" />
                            <input type="hidden" id="signature" name="signature" />
                            <input type="hidden" id="credentialId" name="credentialId" />
                            <input type="hidden" id="userHandle" name="userHandle" />
                            <input type="hidden" id="error" name="error" />
                        </form>

                        {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
                            <>
                                <form id="authn_select" className={kcClsx("kcFormClass")}>
                                    {authenticators.authenticators.map((authenticator, i) => (
                                        <input key={i} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                                    ))}
                                </form>
                            </>
                        )}
                    </FieldGroup>
                </>
            )}
        </Template>
    );
}
