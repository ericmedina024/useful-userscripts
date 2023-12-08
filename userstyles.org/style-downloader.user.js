// ==UserScript==
// @name         Userstyles.org downloader
// @namespace    https://ericmedina024.com/
// @version      0.1
// @description  Lets you download styles from userstyles.org without Styilsh. Clicking the install button will now download the CSS.
// @author       Eric Medina (https://github.com/EricMedina024)
// @match        https://userstyles.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=userstyles.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const downloadString = function downloadString(fileName, stringToDownload) {
        console.log(stringToDownload);
        var downloadAnchor = document.createElement('a');
        downloadAnchor.href = 'data:text/css;base64,' + btoa(stringToDownload);
        downloadAnchor.target = '_blank';
        downloadAnchor.download = `${fileName}.txt`;
        downloadAnchor.click();
    }

    const isInstallButton = function isInstallButton(element) {
        return element.closest("[data-stylish='install-style-button']") !== null;
    };

    const getCurrentStyleId = function getCurrentStyleId() {
        return document.location.pathname.split("/")[2];
    };

    const getStyleDetails = function getStyleDetails(styleId) {
        return fetch(`https://userstyles.org/styles/chrome/${getCurrentStyleId()}.json`)
            .then(response => response.json());
    };

    const getStyleCode = function getStyleCode(styleDetails) {
        let styleCode = "";
        styleDetails.sections.forEach((section, index) => {
            const {code, ...sectionWithoutCode} = section;
            styleCode += `/* Section ${index + 1} - ${CSS.escape(JSON.stringify(sectionWithoutCode))} */`;
            styleCode += "\n";
            styleCode += code;
            styleCode += "\n";
        });
        return styleCode;
    };

    document.addEventListener("click", event => {
        if (isInstallButton(event.target)) {
            const currentStyleId = getCurrentStyleId();
            getStyleDetails()
                .then(getStyleCode)
                .then(styleCode => downloadString(`userstyles-style-${currentStyleId}.css`, styleCode));
            event.preventDefault();
        }
    });

})();
