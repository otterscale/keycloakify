import { useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginUsername.useScript";
import { Logo } from "@/components/svg/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError, FieldSeparator } from "@/components/ui/field";
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
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <a href="https://otterscale.io" className="flex flex-col items-center gap-2 font-medium">
                                            <div className="flex h-8 items-center justify-center rounded-md">
                                                <Logo className="size-56" />
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
                                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                                        <>
                                            <FieldSeparator>{msg("identity-provider-login-label")}</FieldSeparator>
                                            <Field className={clsx("grid gap-4", social.providers.length > 1 ? "sm:grid-cols-2" : "sm:grid-cols-1")}>
                                                {social.providers.map((...[p, ,]) => (
                                                    <Button variant="outline" type="button" asChild>
                                                        <a id={`social-${p.alias}`} href={p.loginUrl}>
                                                            <ProviderIcon id={p.providerId} />
                                                            {p.displayName}
                                                        </a>
                                                    </Button>
                                                ))}
                                            </Field>
                                        </>
                                    )}
                                </FieldGroup>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            {enableWebAuthnConditionalUI && (
                <>
                    <FieldGroup className="pt-4">
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

function ProviderIcon(props: { id: string }) {
    const { id } = props;

    switch (id) {
        case "google":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133c-1.147 1.147-2.933 2.4-6.053 2.4c-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0C5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36c2.16-2.16 2.84-5.213 2.84-7.667c0-.76-.053-1.467-.173-2.053z"
                    />
                </svg>
            );

        case "microsoft":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M0 0v11.408h11.408V0zm12.594 0v11.408H24V0zM0 12.594V24h11.408V12.594zm12.594 0V24H24V12.594z" />
                </svg>
            );

        case "facebook":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978c.401 0 .955.042 1.468.103a9 9 0 0 1 1.141.195v3.325a9 9 0 0 0-.653-.036a27 27 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.7 1.7 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103l-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647"
                    />
                </svg>
            );

        case "instagram":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388a5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947s.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911c.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552c1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388a5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912c.056-1.28.07-1.69.063-4.948c-.006-3.258-.02-3.667-.081-4.947c-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123a5.9 5.9 0 0 0-2.128-1.38c-.764-.294-1.636-.496-2.914-.55C15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895a3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228c-.06-1.264-.072-1.644-.08-4.848c-.006-3.204.006-3.583.061-4.848c.05-1.169.246-1.805.408-2.228c.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417c1.265-.06 1.644-.072 4.848-.08c3.203-.006 3.583.006 4.85.062c1.168.05 1.804.244 2.227.408c.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227c.06 1.265.074 1.645.08 4.848c.005 3.203-.006 3.583-.061 4.848c-.051 1.17-.245 1.805-.408 2.23c-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418c-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442a1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024a6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16A4 4 0 0 1 8 12.008"
                    />
                </svg>
            );

        case "twitter":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M14.234 10.162L22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299l-.929-1.329L3.076 1.56h3.182l5.965 8.532l.929 1.329l7.754 11.09h-3.182z"
                    />
                </svg>
            );

        case "linkedin":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"
                    />
                </svg>
            );

        case "stackoverflow":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="m15.725 0l-1.72 1.277l6.39 8.588l1.716-1.277zm-3.94 3.418l-1.369 1.644l8.225 6.85l1.369-1.644zm-3.15 4.465l-.905 1.94l9.702 4.517l.904-1.94zm-1.85 4.86l-.44 2.093l10.473 2.201l.44-2.092l-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396zm4.265 2.133v2.13h10.66v-2.13H6.154Z"
                    />
                </svg>
            );

        case "github":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    />
                </svg>
            );

        case "gitlab":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="m23.6 9.593l-.033-.086L20.3.98a.85.85 0 0 0-.336-.405a.875.875 0 0 0-1 .054a.9.9 0 0 0-.29.44L16.47 7.818H7.537L5.333 1.07a.86.86 0 0 0-.29-.441a.875.875 0 0 0-1-.054a.86.86 0 0 0-.336.405L.433 9.502l-.032.086a6.066 6.066 0 0 0 2.012 7.01l.01.009l.03.021l4.977 3.727l2.462 1.863l1.5 1.132a1.01 1.01 0 0 0 1.22 0l1.499-1.132l2.461-1.863l5.006-3.75l.013-.01a6.07 6.07 0 0 0 2.01-7.002"
                    />
                </svg>
            );

        case "bitbucket":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M.778 1.213a.768.768 0 0 0-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.77.77 0 0 0 .77-.646l3.27-20.03a.768.768 0 0 0-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z"
                    />
                </svg>
            );

        case "paypal":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513c-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541c-.195 2.741-2.655 5.483-6.441 5.483H8.714Z"
                    />
                </svg>
            );

        case "openshift":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M21.665 11.812a11.1 11.1 0 0 0-1.08-3.966L24 6.599a11 11 0 0 0-.943-1.595l-1.601.583a11.015 11.015 0 0 0-19.945 7.258l1.604-.584q.077.924.305 1.822L0 15.335a11.2 11.2 0 0 0 1.721 3.731l1.812-.659c3.526 4.95 10.398 6.106 15.349 2.58a11 11 0 0 0 3.599-4.332a10.9 10.9 0 0 0 .991-5.497zm-4.74-2.635a7.2 7.2 0 0 1 .895 4.032l1.809-.657a7 7 0 0 1-.646 2.471a7.166 7.166 0 0 1-9.514 3.472a7.1 7.1 0 0 1-2.092-1.49l-1.813.66a7.2 7.2 0 0 1-1.903-3.667l3.426-1.242a7 7 0 0 1-.111-1.896H6.97l-1.604.583a7.14 7.14 0 0 1 10.156-5.929v-.006a7.1 7.1 0 0 1 2.082 1.483l1.599-.582l.006.005c.441.454.82.965 1.128 1.518z"
                    />
                </svg>
            );
    }
}
