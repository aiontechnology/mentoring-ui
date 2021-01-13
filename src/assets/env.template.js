(function(window) {
    window["env"] = window["env"] || {};
    
    window["env"]["production"] = "${IS_PRODUCTION}";
    window["env"]["apiUri"] = "${API_URL}";
    window["env"]["lpgUri"] = "${LPG_URL}";
    window["env"]["tokenRedirect"] = "${TOKEN_REDIRECT}";
    window["env"]["logoutRedirect"] = "${LOGOUT_TOKEN_REDIRECT}";
    window["env"]["cognitoBaseUrl"] = "${COGNITO_BASE_URL}";
    window["env"]["cognitoClientId"] = "${COGNITO_CLIENT_ID}";
})(this);