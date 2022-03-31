import Image from "next/image";
import { isLogged, useUserInformation } from "../../state/user/hooks";
import { useDispatch } from "react-redux";
import { logout } from "../../state/user/actions";
import { ButtonBlue, ButtonGreen, ButtonOrange } from "../../components/Button";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import { toast } from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { shortenString } from "../../functions/format";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";

export default function User(): JSX.Element {
  const url =
    process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta");

  const connection = new Connection(url);

  const logged = isLogged();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  function logoutAPI() {
    dispatch(logout());
  }

  const wallet = useWallet();
  const modal = useWalletModal();

  const [tokens, setTokens] = useState(0);

  const fetch_tokens = useCallback(async () => {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      wallet.publicKey,
      {
        mint: new PublicKey("EGiWZhNk3vUNJr35MbL2tY5YD6D81VVZghR2LgEFyXZh"),
        programId: TOKEN_PROGRAM_ID,
      }
    );
    if (tokenAccounts.value.length === 0) {
      setTokens(0);
    } else {
      const accountInfo = AccountLayout.decode(
        tokenAccounts.value[0].account.data
      );
      setTokens(
        Number((accountInfo.amount * BigInt(100)) / BigInt(LAMPORTS_PER_SOL)) /
          100
      );
    }
  }, [connection, wallet]);

  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return;
    fetch_tokens();
  }, [wallet]);

  const [user, setUser] = useState<{
    id: string;
    address: string | null;
    bit: number;
  } | null>();

  const userInfo = useUserInformation();

  const fetch_user = useCallback(async () => {
    const data = await axios.post("/api/user", { uid: userInfo.id });
    const bit = await axios.post("/api/inventory", { uid: userInfo.id });
    setUser({
      id: userInfo.id,
      address: data.data.address,
      bit: bit.data.amount,
    });
    setLoading(false);
  }, [userInfo]);

  function connect(): JSX.Element {
    return wallet.connected ? (
      <ButtonOrange
        text={shortenString(wallet.publicKey.toString(), 9)}
        onClick={() => wallet.disconnect()}
      />
    ) : (
      <ButtonGreen text={"Connect"} onClick={() => modal.setVisible(true)} />
    );
  }

  useEffect(() => {
    if (!logged) {
      router.push("/auth/login");
      setLoading(false);
      return;
    }
    fetch_user();
  }, [logged]);

  async function uploadSignature(uid, signature, publicKey) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const success = await axios.post("/api/update", {
          uid,
          signature,
          publicKey,
        });
        if (success.status !== 200 || !success.data.success) reject();
        resolve();
      } catch (e) {
        reject();
      }
    });
  }

  return (
    <div className="relative z-10 mx-4 h-full pb-10">
      {loading ? (
        <div className="mt-32">
          <Loader />
        </div>
      ) : (
        <>
          <div className="pt-14 text-center flex flex-row justify-center items-center gap-x-10">
            <div className="hidden md:inline-flex ml-10">
              <Image
                src="/img/separator-right.svg"
                width="250"
                height="17"
                alt="Bitmon Separator"
              />
            </div>
            <div>
              <h1 className="text-4xl uppercase">Welcome</h1>
            </div>
            <div className="hidden md:inline-flex mr-10">
              <Image
                src="/img/separator-left.svg"
                width="250"
                height="17"
                alt="Bitmon Separator"
              />
            </div>
          </div>
          <div className="bg-white rounded-lg w-[300px] mx-auto py-5 my-10">
            <h2 className="text-center text-md">Welcome to Bitmon</h2>
            <h2 className="text-center mt-3">Your user ID is</h2>
            <h2 className="text-sm text-center my-2">
              <span className="text-red-800 text-xs">{user.id}</span>
            </h2>
            <h2 className="text-center mt-3">Your linked address is</h2>
            <h2 className="text-center mb-3">
              {user.address ? (
                <span className="text-red-800 text-xs">
                  {shortenString(user.address, 24)}
                </span>
              ) : (
                <span className="text-red-800 text-xs">
                  You don't have a linked address
                </span>
              )}
            </h2>
            {wallet.connected ? (
              <>
                <h2 className="text-center mt-3 mb-2 text-md">
                  On-Chain $BIT Balance
                </h2>
                <h2 className="text-center mb-3">
                  <span className="text-red-800 text-lg">{tokens}</span>
                </h2>
              </>
            ) : null}
            <h2 className="text-center mt-3 mb-2 text-md">
              In-Game $BIT Balance
            </h2>
            <h2 className="text-center mb-3">
              <span className="text-red-800 text-lg">{user.bit}</span>
            </h2>
            <h2 className="text-center mt-3 mb-2">Link or update address</h2>
            <div className="flex flex-row justify-center">{connect()}</div>
            {wallet.connected ? (
              <div className="mt-5">
                <ButtonBlue
                  text="Update"
                  onClick={async () => {
                    const sig = await wallet.signMessage(Buffer.from(user.id));
                    toast
                      .promise(
                        uploadSignature(
                          user.id,
                          Buffer.from(sig).toString("hex"),
                          wallet.publicKey.toBuffer().toString("hex")
                        ),
                        {
                          loading: <b>Updating address</b>,
                          success: <b>Success</b>,
                          error: <b>Try again</b>,
                        }
                      )
                      .then(() =>
                        setUser({
                          id: user.id,
                          address: wallet.publicKey.toString(),
                          bit: user.bit,
                        })
                      );
                  }}
                />
              </div>
            ) : null}
            <div className="mt-5 w-[200px] mx-auto">
              <ButtonOrange text="Sign Out" onClick={() => logoutAPI()} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
