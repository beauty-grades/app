import { cache } from "react";

import xata from "@/lib/xata";

const getStatus = cache(async (id: string | undefined | null) => {
  if (!id) return null;
  const status = await xata.db.status.read(id, ["*", "author_profile.*"]);

  return status;
});

export { getStatus };
