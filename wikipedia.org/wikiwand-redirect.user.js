// ==UserScript==
// @name         Redirect Wikipedia to Wikiwand
// @namespace    https://ericmedina024.com/
// @version      2024-01-06
// @description  Redirects Wikipedia articles to Wikiwand without the extension
// @author       Eric Medina (https://github.com/ericmedina024)
// @match        https://*.wikipedia.org/wiki/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    const pageLanguage = window.location.host.split(".")[0];
    const pageName = window.location.pathname.split("/").pop();
    const pagesToIgnore = ["Special:Search"];

    if (!pagesToIgnore.includes(pageName)) {
        const wikiwandUrl = new URL(`/${pageLanguage}/${pageName}`, "https://www.wikiwand.com");
        window.location.replace(wikiwandUrl.toString());
    }

})();