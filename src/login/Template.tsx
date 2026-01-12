import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

import { AlertCircle, Globe, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";

import "../index.css";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="absolute top-4 right-4 flex p-4 md:top-12 md:right-12">
                {enabledLanguages.length > 1 && (
                    <div className={kcClsx("kcLocaleMainClass")} id="kc-locale">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost" aria-label="Open menu" size="icon-sm">
                                    <Globe />
                                    <span className="sr-only">Change language</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-36" align="end">
                                <DropdownMenuRadioGroup value={currentLanguage.languageTag}>
                                    {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                        <DropdownMenuRadioItem value={languageTag}>
                                            <a role="menuitem" id={`language-${i + 1}`} href={href}>
                                                {label}
                                            </a>
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
            {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
            {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                <div className="absolute top-4 flex p-4 md:top-12">
                    {(message.type === "success" || message.type === "info") && (
                        <AlertWrapper variant="default" icon={<Info />} summary={message.summary} />
                    )}
                    {(message.type === "warning" || message.type === "error") && (
                        <AlertWrapper variant="destructive" icon={<AlertCircle />} summary={message.summary} />
                    )}
                </div>
            )}
            <div className="w-full max-w-sm">
                <div className={kcClsx("kcFormCardClass")}>
                    <header className={kcClsx("kcFormHeaderClass")}>
                        {(() => {
                            const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                <h1 id="kc-page-title">{headerNode}</h1>
                            ) : (
                                <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                    <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                        <div className="kc-login-tooltip">
                                            <i className={kcClsx("kcResetFlowIcon")}></i>
                                            <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                        </div>
                                    </a>
                                </div>
                            );

                            if (displayRequiredFields) {
                                return (
                                    <div className={kcClsx("kcContentWrapperClass")}>
                                        <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                            <span className="subtitle">
                                                <span className="required">*</span>
                                                {msg("requiredFields")}
                                            </span>
                                        </div>
                                        <div className="col-md-10">{node}</div>
                                    </div>
                                );
                            }

                            return node;
                        })()}
                    </header>
                    <div id="kc-content">
                        <div id="kc-content-wrapper">
                            {children}
                            {auth !== undefined && auth.showTryAnotherWayLink && (
                                <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                    <div className={kcClsx("kcFormGroupClass")}>
                                        <input type="hidden" name="tryAnotherWay" value="on" />
                                        <a
                                            href="#"
                                            id="try-another-way"
                                            onClick={event => {
                                                document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                                event.preventDefault();
                                                return false;
                                            }}
                                        >
                                            {msg("doTryAnotherWay")}
                                        </a>
                                    </div>
                                </form>
                            )}
                            {socialProvidersNode}
                            {displayInfo && (
                                <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                    <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                                        {infoNode}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AlertWrapper(props: { variant: "default" | "destructive" | null | undefined; icon: JSX.Element; summary: string }) {
    const { variant, icon, summary } = props;

    return (
        <Alert variant={variant}>
            {icon}
            <AlertDescription>
                <span
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(summary)
                    }}
                />
            </AlertDescription>
        </Alert>
    );
}
