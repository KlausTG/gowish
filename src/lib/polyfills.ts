import * as ExpoCrypto from "expo-crypto";

if (typeof globalThis.crypto?.randomUUID !== "function") {
  globalThis.crypto = {
    ...(globalThis.crypto ?? {}),
    randomUUID: ExpoCrypto.randomUUID,
    getRandomValues: ExpoCrypto.getRandomValues,
  } as Crypto;
}
