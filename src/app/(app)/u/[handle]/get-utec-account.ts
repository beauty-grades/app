import { cache } from "react";

import xata from "@/lib/xata";

export const getUtecAccount = cache(
  async (email: string | undefined | null) => {
    try {
      const utec_account = await xata.db.utec_account
        .filter({ email })
        .select(["*", "curriculum.career.*"])
        .getFirst();

      return utec_account;
    } catch (error) {
      return null;
    }
  }
);
