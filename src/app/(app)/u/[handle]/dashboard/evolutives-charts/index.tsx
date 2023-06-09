import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/typography";
import { getScoreAndRankingByPeriod } from "./getScoreAndRankingByPeriod";
import { RankingChart } from "./ranking-chart";
import { ScoreChart } from "./score-chart";

export const EvolutivesCharts = async ({
  utec_account,
}: {
  utec_account: string;
}) => {
  const periods = await getScoreAndRankingByPeriod(utec_account);

  return (
    <>
      <Heading as="h2">Gráficos evolutivos</Heading>
      <Tabs defaultValue="score" className="w-full">
        <TabsList>
          <TabsTrigger value="score">Score</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
        </TabsList>
        <TabsContent value="score">
          <ScoreChart data={periods} />
        </TabsContent>
        <TabsContent value="ranking">
          <RankingChart data={periods} />
        </TabsContent>
      </Tabs>
    </>
  );
};
