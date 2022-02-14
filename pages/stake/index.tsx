import Image from "next/image";
import {
  getParsedNftAccountsByOwner,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import { ConnectWalletWarning } from "../../components/ConnectWalletWarning";
import { intersect } from "@hapi/hoek";
import { TRAINER_MINTS } from "../../constants/mints";

export default function Stake(): JSX.Element {
  const url =
    process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta");
  const connect = createConnectionConfig(url);

  const wallet = useWallet();

  const [loading, setLoading] = useState(true);

  const [tokens, setTokens] = useState([]);

  const fetch_tokens = useCallback(async () => {
    setLoading(true);

    // Fetch user tokens
    const tokensList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey.toString(),
      connection: connect,
    });

    const validBitmonMints = intersect(
      TRAINER_MINTS,
      tokensList.map((t) => t.mint)
    );
    const tokens = tokensList.filter((t) => validBitmonMints.includes(t.mint));
    setTokens(tokens);
    setLoading(false);
  }, [wallet, connect, getParsedNftAccountsByOwner]);

  useEffect(() => {
    if (!wallet || !wallet.connected || !wallet.publicKey) return;
    fetch_tokens();
  }, [wallet]);

  return (
    <div className="relative z-10 mx-4 h-full pb-10">
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
          <Image
            src="/img/trainer-creator.png"
            width="200"
            height="85"
            alt="Bitmon Separator"
          />
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
      <div className="mt-6">
        {wallet.connected ? (
          loading ? (
            <Loader />
          ) : tokens.length > 0 ? (
            <div className="text-center">
              <div className="flex flex-row items-center justify-center bg-contain bg-no-repeat bg-center bg-title-background h-[58px] mx-auto">
                <p className="top-0 text-xl text-white">
                  Stake your <span className="text-orange">trainers</span> to
                  get some <span className="text-orange">$BIT</span>
                </p>
              </div>
              <div className="z-10 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-3/4 mx-auto"></div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center bg-contain bg-no-repeat bg-center bg-title-background h-[58px] mx-auto">
              <p className="top-0 text-xl text-white">
                No Bitmon trainers found.
              </p>
            </div>
          )
        ) : (
          <ConnectWalletWarning />
        )}
      </div>
    </div>
  );
}
