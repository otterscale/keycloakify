import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { RealmLogo } from "@/components/realm-logo";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";

import "../../index.css";

type LoginUpdateProfileProps = PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { messagesPerField, url, isAppInitiatedAction, realm } = kcContext;

    const { msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={null}
            displayMessage={messagesPerField.exists("global")}
        >
            <form id="kc-update-profile-form" action={url.loginAction} method="post">
                <FieldGroup>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <a href="https://otterscale.io" className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex h-8 items-center justify-center rounded-md">
                                <RealmLogo displayNameHtml={realm.displayNameHtml} className="size-56" />
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
                    <Field className="flex gap-4">
                        <Button disabled={!isFormSubmittable} type="submit">
                            {msgStr("doSubmit")}
                        </Button>
                        {isAppInitiatedAction && (
                            <Button variant="secondary" type="submit" name="cancel-aia" value="true" formNoValidate>
                                {msgStr("doCancel")}
                            </Button>
                        )}
                    </Field>
                </FieldGroup>
            </form>
        </Template>
    );
}
