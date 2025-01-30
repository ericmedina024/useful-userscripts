// ==UserScript==
// @name        OpenLocationCodes for DuckDuckGo
// @namespace   ericmedina024.com
// @match       https://duckduckgo.com/*
// @require     https://cdn.jsdelivr.net/openlocationcode/latest/openlocationcode.min.js
// @grant       none
// @version     1.0
// @author      Eric Medina
// @description Adds OpenLocationCodes to the DuckDuckGo map address field
// ==/UserScript==

(async () => {

  const nativeFetch = window.fetch;

  window.fetch = async function() {
    const response = await nativeFetch(...arguments);
    const contentType = response.headers.get("Content-Type");
    if (contentType == null || !contentType.includes("application/javascript")) {
      return response;
    }
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (error) {
      return response;
    }
    if ("results" in responseBody) {
      for (let result of responseBody.results) {
        if ("address" in result && "address_lines" in result) {
          const locationCode = OpenLocationCode.encode(result.coordinates.latitude, result.coordinates.longitude, OpenLocationCode.CODE_PRECISION_EXTRA);
          result["address"] += " ";
          result["address"] += locationCode;
          result["address_lines"].push(locationCode);
        }
      }
    }
    const freshResponse = await nativeFetch(...arguments);
    freshResponse.json = async () => responseBody;
    return freshResponse;
  }
  
})();
