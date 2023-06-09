import Xata from "@/lib/xata";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Classroom {
  id: string;
  section: number;
  score: number;
  teacher: {
    id: string;
    name: string;
  };
}

interface Evaluation {
  handle: string;
  label: string;
  weight: number | null;
  can_be_deleted: boolean;
}

const getEvaluationsByPeriod = async (course_handle: string) => {
  const raw_classrooms = await Xata.db.section
    .select(["*", "class.course.*", "teacher.*", "class.period"])
    .filter({ "class.course": course_handle })
    .getAll();

  const raw_evaluations = await Xata.db.evaluation
    .select(["*", "class.*", "class.course.*", "class.period.*"])
    .filter({ "class.course": course_handle })
    .getAll();

  const periods: {
    period: string;
    evaluations: Evaluation[];
    classrooms: Classroom[];
    wrong_formula: boolean;
  }[] = [];

  raw_evaluations.forEach((raw_evaluation) => {
    if (!raw_evaluation.class) return;
    if (!raw_evaluation.class.course) return;

    const period = raw_evaluation.class.period?.id || "";

    const evaluation = {
      handle: raw_evaluation.handle || "",
      label: raw_evaluation.label || "",
      weight: raw_evaluation.weight || null,
      can_be_deleted: raw_evaluation.can_be_deleted,
    };

    const period_evaluations = periods.find(
      (period_evaluations) => period_evaluations.period === period
    );

    if (period_evaluations) {
      period_evaluations.evaluations.push(evaluation);
    } else {
      periods.push({
        period,
        evaluations: [evaluation],
        classrooms: [],
        wrong_formula: raw_evaluation.class?.wrong_formula || false,
      });
    }
  });

  raw_classrooms.forEach((raw_classroom) => {
    const classroom_period = raw_classroom.class?.period?.id;

    const existing_period = periods.find(
      ({ period }) => classroom_period === period
    );

    existing_period?.classrooms.push({
      id: raw_classroom.id,
      section: raw_classroom.section || 0,
      score: raw_classroom.score || 0,
      teacher: {
        name: raw_classroom.teacher?.name || "Unknown",
        id: raw_classroom.teacher?.id || "ukn",
      },
    });
  });

  periods.sort(
    (a, b) =>
      parseInt(a.period.replace("-", "")) - parseInt(b.period.replace("-", ""))
  );
  return periods;
};

interface Props {
  course_handle: string;
}

export const PeriodsView = async ({ course_handle }: Props) => {
  const periods = await getEvaluationsByPeriod(course_handle);

  return (
    <div>
      <Tabs defaultValue="all" className="mb-4 w-full">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          {periods.map(({ period }) => (
            <TabsTrigger key={period} value={period}>
              <span>{period}</span>
              <div id={`badge-for-${period}`} className="ml-2"></div>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent id="all" value="all">
          TODO: Stats for all periods
        </TabsContent>
        {periods.map(({ period, evaluations, classrooms, wrong_formula }) => (
          <TabsContent id={`period:${period}`} key={period} value={period}>
            <Card>
              <CardHeader>
                <CardTitle>{period}</CardTitle>
                <CardDescription>Conoce más de esta clase</CardDescription>
              </CardHeader>
              <CardContent>
                {wrong_formula ? (
                  <WrongFormulaEvaluations
                    evaluations={evaluations}
                    period={period}
                  />
                ) : (
                  <Evaluations evaluations={evaluations} period={period} />
                )}

                <div
                  id={`final_score-${period}`}
                  className="ml-60 mt-2 pl-2 text-lg font-bold"
                ></div>

                <Separator className="my-4" />
                <Classrooms classrooms={classrooms} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const Classrooms = ({ classrooms }: { classrooms: Classroom[] }) => {
  return (
    <ul>
      {classrooms.map(({ id, section, teacher, score }) => {
        return (
          <li key={id}>
            <p className="font-bold italic">Sección {section}</p>
            <p className="ml-4">{teacher.name}</p>
            <p className="ml-4">{score}</p>
          </li>
        );
      })}
    </ul>
  );
};

const WrongFormulaEvaluations = ({
  evaluations,
  period,
}: {
  evaluations: Evaluation[];
  period: string;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {evaluations.map(({ label, handle }) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex w-60 items-center justify-between">
            <span className="font-bold">{label}</span>
            <span
              id={`grade-${period}-${handle}`}
              className="text-slate-600"
            ></span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Evaluations = ({
  evaluations,
  period,
}: {
  evaluations: Evaluation[];
  period: string;
}) => {
  let grouped_evaluations: {
    label: string;
    total_weight: number | null;
    can_be_deleted: boolean;
    children: {
      handle: string;
      weight: number | null;
    }[];
  }[] = [];

  evaluations.forEach(({ handle, label, weight, can_be_deleted }) => {
    const g_e_match = grouped_evaluations.find(
      ({ label: existing_label }) => existing_label === label
    );

    if (!g_e_match) {
      grouped_evaluations.push({
        label,
        total_weight: weight,
        can_be_deleted,
        children: [
          {
            handle,
            weight,
          },
        ],
      });
    } else {
      if (weight && g_e_match?.total_weight) {
        g_e_match.total_weight += weight;
      }
      g_e_match.children.push({
        handle,
        weight,
      });
    }
  });

  return (
    <div className="flex flex-col gap-4">
      {grouped_evaluations.map(
        ({ label, total_weight }) =>
          total_weight && (
            <div key={label} className="flex items-center gap-2">
              <div className="flex w-60 items-center justify-between">
                <span className="font-bold">{label}</span>
                <span className="text-slate-600">
                  {Math.round(total_weight * 100)}%
                </span>
              </div>
              <div className="grow">
                <div
                  id={`${period}:${label}`}
                  style={{
                    width: `${total_weight * 100}%`,
                  }}
                  className="evaluation-weight relative h-14 overflow-hidden rounded-lg bg-slate-700"
                />
              </div>
            </div>
          )
      )}
    </div>
  );
};
