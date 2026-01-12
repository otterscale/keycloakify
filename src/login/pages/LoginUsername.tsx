import { useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginUsername.useScript";
import { ArcticonsOtter } from "@/components/svg/arcticons-otter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import "../../index.css";

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, registrationDisabled, messagesPerField, enableWebAuthnConditionalUI, authenticators } =
        kcContext;

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
            displayMessage={!messagesPerField.existsError("username")}
            headerNode={null}
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr />
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                                {social.providers.map((...[p, , providers]) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className={kcClsx(
                                                "kcFormSocialAccountListButtonClass",
                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                            )}
                                            type="button"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                            <span className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}>
                                                {p.displayName}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <div className="flex flex-col gap-6">
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
                                                <ArcticonsOtter className="size-12" />
                                            </div>
                                            <span className="sr-only">OtterScale</span>
                                        </a>
                                        {realm.password && realm.registrationAllowed && !registrationDisabled && (
                                            <FieldDescription>
                                                <div id="kc-registration">
                                                    <span>
                                                        {msg("noAccount")}{" "}
                                                        <a tabIndex={6} href={url.registrationUrl} className="hover:underline">
                                                            {msg("doRegister")}
                                                        </a>
                                                    </span>
                                                </div>
                                            </FieldDescription>
                                        )}
                                    </div>
                                    {!usernameHidden && (
                                        <Field>
                                            <FieldLabel htmlFor="username">
                                                {!realm.loginWithEmailAllowed
                                                    ? msg("username")
                                                    : !realm.registrationEmailAsUsername
                                                      ? msg("usernameOrEmail")
                                                      : msg("email")}
                                            </FieldLabel>
                                            <Input
                                                tabIndex={2}
                                                id="username"
                                                name="username"
                                                defaultValue={login.username ?? ""}
                                                type="text"
                                                autoFocus
                                                autoComplete="off"
                                                aria-invalid={messagesPerField.existsError("username")}
                                            />
                                            {messagesPerField.existsError("username") && (
                                                <FieldError>{messagesPerField.getFirstError("username")}</FieldError>
                                            )}
                                        </Field>
                                    )}
                                    {realm.rememberMe && !usernameHidden && (
                                        <Field orientation="horizontal">
                                            <Checkbox tabIndex={3} id="rememberMe" name="rememberMe" defaultChecked={!!login.rememberMe} />
                                            <FieldLabel htmlFor="rememberMe">{msg("rememberMe")}</FieldLabel>
                                        </Field>
                                    )}
                                    <Field>
                                        <Button tabIndex={4} disabled={isLoginButtonDisabled} name="login" id="kc-login" type="submit">
                                            {msgStr("doLogIn")}
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </div>
                    )}
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
