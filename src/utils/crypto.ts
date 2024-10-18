import CryptoJS from "crypto-js";
const secretKey = 'template-secretKey';
export const encrypt = (data: string) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};