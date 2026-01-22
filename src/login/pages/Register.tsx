import type { JSX } from "keycloakify/tools/JSX";
import { useState, useLayoutEffect } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Logo } from "@/components/svg/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";

import "../../index.css";
import { ChevronLeft } from "lucide-react";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } = kcContext;

    const { msg, msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    useLayoutEffect(() => {
        (window as any)["onSubmitRecaptcha"] = () => {
            // @ts-expect-error
            document.getElementById("kc-register-form").requestSubmit();
        };

        return () => {
            delete (window as any)["onSubmitRecaptcha"];
        };
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={null}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields={false}
        >
            <form id="kc-register-form" action={url.registrationAction} method="post">
                <FieldDescription id="kc-form-options" className="pb-6">
                    <span>
                        <a href={url.loginUrl} className="flex items-center gap-1 hover:underline">
                            <ChevronLeft className="size-4" />
                            {msgStr("backToLogin").replace(/&laquo;/g, "")}
                        </a>
                    </span>
                </FieldDescription>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <a href="https://otterscale.com" className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex h-8 items-center justify-center rounded-md">
                                <Logo className="size-16 stroke-2" />
                            </div>
                            <span className="sr-only">OtterScale</span>
                        </a>
                    </div>
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />
                    {termsAcceptanceRequired && (
                        <Field>
                            <Field orientation="horizontal">
                                <Checkbox
                                    required
                                    id="termsAccepted"
                                    name="termsAccepted"
                                    checked={areTermsAccepted}
                                    onCheckedChange={checked => setAreTermsAccepted(checked === true)}
                                    aria-invalid={messagesPerField.existsError("termsAccepted")}
                                />
                                <FieldLabel htmlFor="termsAccepted">{msg("acceptTerms")}</FieldLabel>
                            </Field>
                            {messagesPerField.existsError("termsAccepted") && (
                                <FieldError>
                                    <span
                                        id="input-error-terms-accepted"
                                        className={kcClsx("kcInputErrorMessageClass")}
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.get("termsAccepted"))
                                        }}
                                    />
                                </FieldError>
                            )}
                        </Field>
                    )}
                    {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                        <div className="justify-center w-full flex">
                            <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction} />
                        </div>
                    )}
                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                        <div id="kc-form-buttons">
                            <Field>
                                <Button data-sitekey={recaptchaSiteKey} data-callback="onSubmitRecaptcha" data-action={recaptchaAction} type="submit">
                                    {msgStr("doRegister")}
                                </Button>
                            </Field>
                        </div>
                    ) : (
                        <div id="kc-form-buttons">
                            <Field>
                                <Button disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)} type="submit">
                                    {msgStr("doRegister")}
                                </Button>
                            </Field>
                        </div>
                    )}

                    <div className="justify-center flex w-full">
                        <FieldDescription>
                            <a href="/terms-of-service" target="_blank" className="hover:underline">
                                {toTitleCase(msgStr("oauthGrantTos").replace(/\./g, ""))} {/* Of */}
                            </a>
                            {" & "}
                            <a href="/privacy-policy" target="_blank" className="hover:underline">
                                {toTitleCase(msgStr("oauthGrantPolicy").replace(/\./g, ""))}
                            </a>
                        </FieldDescription>
                    </div>
                </FieldGroup>
            </form>
        </Template>
    );
}

const toTitleCase = (str: string | null | undefined): string => {
    if (!str) return "";

    const minorWords: string[] = ["of", "and", "the", "in", "on", "at", "to", "for", "a", "an"];

    return str
        .toLowerCase()
        .split(" ")
        .map((word, index) => {
            if (index > 0 && minorWords.includes(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
};
