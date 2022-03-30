import { sign } from "tweetnacl";
import { setPlayFabUserAddress } from "../../functions/playfab/user";
import { PublicKey } from "@solana/web3.js";

export default async function APIuser(req, res) {
  const { signature, uid, publicKey } = req.body;

  const valid = sign.detached.verify(
    Buffer.from(uid),
    Buffer.from(signature, "hex"),
    Buffer.from(publicKey, "hex")
  );

  if (!valid) {
    res.status(200);
    res.json({ success: false });
    return;
  }

  const success = await setPlayFabUserAddress(
    process.env.LOGIN_KEY,
    process.env.TITLE_ID,
    uid,
    new PublicKey(Buffer.from(publicKey, "hex")).toBase58()
  );

  res.status(200);
  res.json({ success });
  return;
}