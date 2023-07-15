import { StatusCard } from "@/components/status/status-card";
import { getStatus } from "@/lib/queries/get-status";

const TestPage = async () => {
  const status = await getStatus("rec_chtpjqfeimgfude5u6cg");

  if (!status) return "Not found";

  return <StatusCard status={status} />;
};

export default TestPage;
