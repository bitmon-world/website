import { Commitment, PublicKey } from "@solana/web3.js";
import { AccountClient, Program } from "@project-serum/anchor";
import { BaseAccount, BaseAccountManager } from "./base";

export class BaseAnchorAccount<T> extends BaseAccount<T> {}

export class BaseAnchorAccountManager<
  S,
  T extends BaseAnchorAccount<S>
> extends BaseAccountManager<S, T> {
  _accountClient: AccountClient;
  _subscriptionsMap: Record<string, number> = {};

  // @ts-ignore
  constructor(public program: Program<any>, public accountName: string) {
    super();
    this._accountClient = program.account[accountName];
  }

  isValid = (account: any): account is T => {
    throw new Error("isValid not implemented");
  };

  toDomain = async (account: any, publicKey: PublicKey) => {
    throw new Error("toDomain not implemented");
  };

  transform = async (account: any, publicKey: PublicKey): Promise<T> => {
    let domainAccount: any;
    try {
      domainAccount = await this.toDomain(account, publicKey);
    } catch (err) {
      console.error(
        `Failed to transform account ${publicKey} of account type ${this.accountName}`
      );
      throw err;
    }
    if (!this.isValid(domainAccount)) {
      throw new Error(
        `Account ${publicKey} of account type ${this.accountName} is invalid`
      );
    }
    return domainAccount;
  };

  fetch = async (publicKey: PublicKey): Promise<T | undefined> => {
    const account = await this._accountClient.fetchNullable(publicKey);
    if (!account) {
      return undefined;
    }
    return await this.transform(account, publicKey);
  };

  fetchMulti = async (publicKeys: PublicKey[]) => {
    const accounts = await this._accountClient.fetchMultiple(publicKeys);
    const retval: { [key: string]: T | undefined } = {};
    for (let i = 0; i < accounts.length; i++) {
      const [account, publicKey] = [accounts[i], publicKeys[i]];
      if (account) {
        retval[publicKey.toBase58()] = await this.transform(account, publicKey);
      } else {
        retval[publicKey.toBase58()] = undefined;
      }
    }
    return retval;
  };

  subscribe = (
    publicKey: PublicKey,
    callback: (account: T) => any,
    commitment?: Commitment
  ): void => {
    const publicKey58 = publicKey.toBase58();
    if (publicKey58 in this._subscriptionsMap) {
      this._subscriptionsMap[publicKey58] += 1;
    } else {
      this._subscriptionsMap[publicKey58] = 1;
      const eventEmitter = this._accountClient.subscribe(publicKey, commitment);
      eventEmitter.on("change", async (account: T) => {
        const domainAccount = await this.transform(account, publicKey);
        callback(domainAccount);
      });
    }
  };

  unsubscribe = (publicKey: PublicKey, force = false): void => {
    const publicKey58 = publicKey.toBase58();
    const subscriptions = this._subscriptionsMap[publicKey58];
    if (force || subscriptions === 1) {
      this._accountClient.unsubscribe(publicKey);
      delete this._subscriptionsMap[publicKey58];
    } else if (subscriptions > 1) {
      this._subscriptionsMap[publicKey58] -= 1;
    } else {
      console.warn(`Unable to unsubscribe: ${publicKey58}`);
    }
  };

  async subscribeAndFetch(
    publicKey: PublicKey,
    callback: (account: T | undefined) => any,
    commitment?: Commitment
  ): Promise<T | undefined> {
    this.subscribe(publicKey, callback, commitment);
    return await this.fetch(publicKey);
  }

  async fetchNewAccount(
    publicKey: PublicKey,
    timeout: number = 20000,
    commitment: Commitment = "processed"
  ): Promise<T> {
    let account = await this.fetch(publicKey);
    if (account) {
      return account;
    }
    try {
      account = await new Promise((resolve, reject) => {
        this.subscribe(publicKey, resolve, commitment);
        setTimeout(reject, timeout);
      });
    } catch (err) {}
    this.unsubscribe(publicKey);
    if (!account) {
      throw new Error("Reached timeout before account change");
    }
    return account;
  }
}
