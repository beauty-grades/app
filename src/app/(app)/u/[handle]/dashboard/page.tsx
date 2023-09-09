import { notFound } from "next/navigation";

import { getProfile } from "@/lib/queries/get-profile";
import { Separator } from "@/components/ui/separator";
import { getRanking } from "../get-ranking";
import { getUtecAccount } from "../get-utec-account";
import { CoursesTable } from "./courses-table";
import { EvolutivesCharts } from "./evolutives-charts";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const Page = async ({ params }) => {
  const handle = params["handle"];

  const profile = await getProfile(handle);

  if (!profile) {
    notFound();
  }


  const utec_account = await getUtecAccount(profile.email);
  if (!utec_account) return;

  const ranking = await getRanking(
    utec_account?.id,
    utec_account?.curriculum?.id?.split("-")[0]
  );

  return (
    <div>
      <div className="flex h-8 items-center gap-4">
        <div className="text-xl font-bold">
          Promedio Histórico {utec_account.score}
        </div>
        {
          <>
            <Separator orientation="vertical" />
            <Button className="text-xl font-bold" asChild variant="link">
              <Link href={`/curriculums/${utec_account?.curriculum?.id}`}>
              {utec_account?.curriculum?.id}
              </Link>
            </Button>
          </>

        }
        {ranking && (
          <>
            <Separator orientation="vertical" />
            <div className="text-xl font-bold">Puesto {ranking?.nums}</div>
          </>
        )}
      </div>

      <Separator className="my-4" />
      {/* @ts-ignore */}
      <EvolutivesCharts utec_account={utec_account?.id} />

      <Separator className="my-4" />
      {/* @ts-ignore */}
      <CoursesTable utec_account={utec_account?.id} />
    </div>
  );
};

export default Page;
