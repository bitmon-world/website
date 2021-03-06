import { PublicKey } from "@solana/web3.js";

export const PROGRAM_NFT_STAKING = new PublicKey(
  "JCnPzmQxxP6XTJAj5nf173Rk5rxtag5dQjgvsb9tQDYA"
);

export const NFT_STAKING_POOL = new PublicKey(
  "Fk6vWeq3aVujGCxYWNvFmeuo9m5tCaukyJi27P47Ug4y"
);

export enum ATTRIBUTES_INDEX {
  BODY_COLOR,
  MOUTH,
  EYE,
  EYEBROW,
  NOSE,
  HAIR,
  BACK_HAIR,
  BEARD,
  ACCESSORY,
  FACE_ACCESSORY,
  MALE_CLOTHES,
  FEMALE_CLOTHES,
  GLASSES,
  BACKGROUND,
  SPECIAL,
}

export const ATTRIBUTES_AMOUNT: { [k: number]: number } = {
  [ATTRIBUTES_INDEX.MOUTH]: 19,
  [ATTRIBUTES_INDEX.EYE]: 15,
  [ATTRIBUTES_INDEX.NOSE]: 6,
  [ATTRIBUTES_INDEX.EYEBROW]: 9,
  [ATTRIBUTES_INDEX.ACCESSORY]: 80,
  [ATTRIBUTES_INDEX.FACE_ACCESSORY]: 22,
  [ATTRIBUTES_INDEX.BACKGROUND]: 70,
  [ATTRIBUTES_INDEX.GLASSES]: 17,
  [ATTRIBUTES_INDEX.HAIR]: 16,
  [ATTRIBUTES_INDEX.BACK_HAIR]: 10,
  [ATTRIBUTES_INDEX.BEARD]: 14,
  [ATTRIBUTES_INDEX.MALE_CLOTHES]: 71,
  [ATTRIBUTES_INDEX.FEMALE_CLOTHES]: 79,
};

export const ATTRIBUTES_PREFIX: { [k: number]: string } = {
  [ATTRIBUTES_INDEX.MOUTH]: "mouth",
  [ATTRIBUTES_INDEX.EYE]: "eye",
  [ATTRIBUTES_INDEX.NOSE]: "nose",
  [ATTRIBUTES_INDEX.EYEBROW]: "eyebrow",
  [ATTRIBUTES_INDEX.ACCESSORY]: "accessory",
  [ATTRIBUTES_INDEX.FACE_ACCESSORY]: "face_accessory",
  [ATTRIBUTES_INDEX.BACKGROUND]: "background",
  [ATTRIBUTES_INDEX.GLASSES]: "glasses",
  [ATTRIBUTES_INDEX.HAIR]: "hair",
  [ATTRIBUTES_INDEX.BACK_HAIR]: "back_hair",
  [ATTRIBUTES_INDEX.BEARD]: "beard",
  [ATTRIBUTES_INDEX.GLASSES]: "glasses",
  [ATTRIBUTES_INDEX.MALE_CLOTHES]: "clothes",
  [ATTRIBUTES_INDEX.FEMALE_CLOTHES]: "clothes",
};

export const EYE_COLORS: { [k: number]: string } = {
  1: "#483823",
  2: "#afaaaf",
  3: "#799b2d",
  4: "#5a3f5e",
  5: "#4f92bd",
  6: "#b53839",
  7: "#af4369",
  8: "#b58850",
};

export const BODY_COLOR: { [k: number]: string } = {
  1: "#d0a884",
  2: "#fceee3",
  3: "#eab874",
  4: "#392a27",
  5: "#f7c7c3",
  6: "#bbb7cd",
  7: "#cec96b",
  8: "#cf7bb3",
  9: "#b58850",
  10: "#ffe599",
  11: "#ffd966",
  12: "#bf9000",
  13: "#7f6000",
  14: "#f9cb9c",
  15: "#f6b26b",
  16: "#e69138",
  17: "#b45f06",
  18: "#ea9999",
  19: "#e06666",
  20: "#a61c00",
  21: "#85200c",
  22: "#660000",
  23: "#5b0f00",
  24: "#000000",
  25: "#cc4125",
  26: "#dd7e6b",
  27: "#ffd966",
  28: "#ea9999",
  29: "#e06666",
  30: "#f4cccc",
};

export const HAIR_COLOR: { [k: number]: string } = {
  1: "#100f0f",
  2: "#f1c669",
  3: "#aa9f9a",
  4: "#457fa1",
  5: "#7d6b65",
  6: "#cb466e",
  7: "#486829",
  8: "#d16151",
  9: "#79358b",
};

export const MINECRAFT_API_URL = "https://minecraft-api.bitmon.io";
export const TRAINERS_API_URL = "https://trainers-api.bitmon.io/";
