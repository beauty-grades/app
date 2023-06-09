import { getStatus } from "@/lib/queries/get-status";
import { StatusCard } from "@/components/status/status-card";

const TestPage = async () => {
  const status = await getStatus("rec_ci0ec8cbgjrmbdajltn0");
  if (!status) return;

  return <StatusCard status={status} />;
};

export default TestPage;
