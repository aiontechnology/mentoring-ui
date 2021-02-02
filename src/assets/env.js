(function(window) {
    window["env"] = window["env"] || {};
    
    window["env"]["production"] = false;
    window["env"]["apiUri"] = "http://localhost:8080";
    window["env"]["lpgUri"] = "http://localhost:8090";
    window["env"]["tokenRedirect"] = "http://localhost:4200/receiveToken";
    window["env"]["logoutRedirect"] = "http://localhost:4200/handleLogout";
    window["env"]["cognitoBaseUrl"] = "mentorsuccess-localhost.auth.us-west-2.amazoncognito.com";
    window["env"]["cognitoClientId"] = "2j1eb0o8qfsbrpaqsftd879c79";
})(this);