import crypto from "crypto";
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return {
    salt,
    hash,
  };
}

export function verifyPassword({
  password,
  salt,
  hash,
}: {
  password: string;
  salt: string;
  hash: string;
}) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}
