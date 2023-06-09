import { cache } from "react";

import Xata from "@/lib/xata";

export const getUtecAccount = cache(
  async (email: string | undefined | null) => {
    try {
      const utec_account = await Xata.db.utec_account
        .filter({ email })
        .select(["*", "curriculum.career.*"])
        .getFirst();

      return utec_account;
    } catch (error) {
      return null;
    }
  }
);
