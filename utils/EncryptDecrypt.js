const crypto = require("crypto");
const envCredential = require("../config");

const path = require("path");
const fs = require("fs");
const publicKeyPath = path.join(__dirname, "..", "config", "public_key.pem");
const privateKeyPath = path.join(__dirname, "..", "config", "private_key.pem");

const privateKey = envCredential.PRIVATEKEY;
const publicKey = envCredential.PUBLICKEY;
const generateKeys = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  console.log("privateKey", privateKey);
  console.log("publicKey", publicKey);

  const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
  const privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" });

  // Define file paths
  const publicKeyPath = path.join(__dirname, "public_key.pem");
  const privateKeyPath = path.join(__dirname, "private_key.pem");

  // Save keys to files
  fs.writeFileSync(publicKeyPath, publicKeyPem, { encoding: "utf8" });
  fs.writeFileSync(privateKeyPath, privateKeyPem, { encoding: "utf8" });
};

const encrypt = (payload) => {
  const bufferMessage = Buffer.from(payload, "utf-8");
  const publicKey = fs.readFileSync(publicKeyPath, "utf8");
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    bufferMessage
  );
  console.log(encrypted.toString("base64"));
  return encrypted.toString("base64");
};

const decrypt = (hashedKey) => {
  const bufferEncrypted = Buffer.from(hashedKey, "base64");
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    bufferEncrypted
  );
  return decrypted.toString("utf-8");
};

module.exports = {
  generateKeys,
  encrypt,
  decrypt,
};
