FROM busybox

COPY dist_keycloak/otterscale-theme.jar /keycloakify

LABEL maintainer="Chung-Hsuan Tsai <paul_tsai@phison.com>"