import axios from "axios";
import { Transaction } from "@solana/web3.js";
import { TrainerAttributes } from "../components/Builder/BuiltImage";
import { API_URL } from "../constants";

export async function fetchBitmons(): Promise<{
  success: boolean;
  data?: string[];
}> {
  try {
    const res = await axios.get(API_URL + "/mints");
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return { success: false };
    }
  } catch (e) {
    return { success: false };
  }
}
