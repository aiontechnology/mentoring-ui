(function(window) {
    window["env"] = window["env"] || {};
    
    window["env"]["production"] = false;
    window["env"]["apiUri"] = "http://localhost:8080";
    window["env"]["lpgUri"] = "http://localhost:8090";
    window["env"]["tokenRedirect"] = "http://localhost:4200/receiveToken";
    window["env"]["logoutRedirect"] = "http://localhost:4200/handleLogout";
    window["env"]["cognitoBaseUrl"] = "mentorsuccess-localhost.auth.us-west-2.amazoncognito.com";
    window["env"]["cognitoClientId"] = "76on3r6c055h1pp2h99uc6jmbd";
})(this);