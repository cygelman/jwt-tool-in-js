(function() {
  const submitButton = document.getElementById("btn-submit-crack");
  submitButton.addEventListener("click", crackJWT);

  function crackJWT() {
    const token = document.getElementById("token").value;
    const result = document.getElementById("key");
    let passwords = document.getElementById("pass").value;

    let tokenSplit = token.split(".");
    let header = tokenSplit[0];
    let payload = tokenSplit[1];
    const tokenSignature = tokenSplit[2];
    let algorithm = findAlgorithm(atob(header));

    passwords = listToArray(passwords);
    header = cleanBase64(header);
    payload = cleanBase64(payload);

    let headerAndPayload = `${header}.${payload}`;

    let key = findKey(headerAndPayload, passwords, tokenSignature, algorithm);

    printResult(key, result);
  }

  /**
   * Delete all unwanted characters for a better comparison
   * @param {*} hashSignature
   */
  function cleanChars(hashSignature) {
    return hashSignature.replace(/[^a-zA-Z0-9]/g, "");
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
   * Take the list of passwords and create an array
   * @param {*} passwordList
   */
  function listToArray(passwordList) {
    return passwordList.split("\n");
  }

  /**
   * Printing the result to the user
   * @param {*} key
   * @param {*} result
   */
  function printResult(key, result) {
    if (key === "") {
      result.className = `alert alert-danger`;
      result.textContent = "Key not found! Try adding more passwords..";
    } else {
      result.className = `alert alert-success`;
      result.textContent = `FOUND! The key is: ${key}`;
    }
    return;
  }

  /**
   * Find the algorithm from the token's header
   * @param {*} decodedHeader
   */
  function findAlgorithm(decodedHeader) {
    if (decodedHeader.includes("HS512")) return "HS512";
    else if (decodedHeader.includes("HS384")) return "HS384";
    else return "HS256";
  }

  /**
   * Find key
   * @param {*} payload
   * @param {*} passwordList
   * @param {*} signature
   * @param {*} algorithmType
   */
  function findKey(
    payload = "",
    passwordList = [],
    signature = "",
    algorithmType = "HS256"
  ) {
    switch (algorithmType) {
      case "HS256":
        return compareHashes(
          CryptoJS.HmacSHA256,
          passwordList,
          payload,
          signature
        );
      case "HS384":
        return compareHashes(
          CryptoJS.HmacSHA384,
          passwordList,
          payload,
          signature
        );
      case "HS512":
        return compareHashes(
          CryptoJS.HmacSHA512,
          passwordList,
          payload,
          signature
        );
      default:
        alert("No such algorithm yet..");
    }
  }

  /**
   * Comapre hashes
   *
   * @param {*} hashFunction
   * @param {*} passwords
   * @param {*} payload
   * @param {*} signature
   */
  function compareHashes(hashFunction, passwords, payload, signature) {
    let hash, hashBase64;

    for (let password of passwords) {
      hash = hashFunction(payload, password);
      hashBase64 = cleanBase64(CryptoJS.enc.Base64.stringify(hash));
      if (cleanChars(hashBase64) === cleanChars(signature)) {
        return password;
      }
    }
    return "";
  }
})();
