const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export default async function sign(params: any): Promise<string> {
  return await signData(buildDataToSign(params), SECRET_KEY);
}

async function signData(data: any, secretKey: any) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = encoder.encode(secretKey);
  const hmacKey = await window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  return window.crypto.subtle
    .sign("HMAC", hmacKey, dataBuffer)
    .then((signatureBuffer) => {
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const signatureHex = signatureArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      return btoa(String.fromCharCode.apply(null, signatureArray));
    });
}

function buildDataToSign(params: any) {
  const signedFieldNames = params["signed_field_names"].split(",");
  const dataToSign = signedFieldNames.map(
    (field: string | number) => `${field}=${params[field]}`
  );
  return commaSeparate(dataToSign);
}

function commaSeparate(dataToSign: any[]) {
  return dataToSign.join(",");
}
