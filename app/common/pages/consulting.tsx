import type { Route } from "../../+types/consulting";
import { useParams } from "react-router";
import Navigation from "~/common/components/navagation";
import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";
import { getFarmById } from "~/services/farm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/common/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/common/components/ui/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/common/components/ui/collapsible";
import { getConsultingPrompt } from "~/common/prompts/consul_prompt";
import { getQuestionPrompt } from "~/common/prompts/question_prompt";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/common/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export async function loader({ params }: Route.LoaderArgs) {
  const farmId = params.farmId;
  if (!farmId) {
    throw new Error("Farm ID is required");
  }
  const farm = await getFarmById(farmId);
  return { farm };
}

export default function Consulting({ loaderData }: Route.ComponentProps) {
  const { farm } = loaderData;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [consultingDate, setConsultingDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [requests, setRequests] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [solution, setSolution] = useState("");
  const [summary, setSummary] = useState("");
  const [isDiagnosisLoading, setIsDiagnosisLoading] = useState(false);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isSolutionLoading, setIsSolutionLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [diagnosisAiResponse, setDiagnosisAiResponse] = useState("");
  const [requestsAiResponse, setRequestsAiResponse] = useState("");
  const [analysisAiResponse, setAnalysisAiResponse] = useState("");
  const [solutionAiResponse, setSolutionAiResponse] = useState("");
  const [summaryAiResponse, setSummaryAiResponse] = useState("");

  // 인터뷰 관련 상태
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [interviews, setInterviews] = useState<Array<{ question: string; answer: string }>>([]);

  // 컨설팅 기록 펼침/접힘 상태
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAiConsultation = async (
    prompt: string,
    setResponse: (response: string) => void,
    setIsLoading: (loading: boolean) => void
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: prompt,
            },
            {
              role: "user",
              content: "분석을 시작해주세요.",
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("OpenAI API 호출 중 오류 발생:", error);
      alert("AI 컨설팅을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const prompts = getConsultingPrompt({
    ...farm,
    size: farm.size ? Number(farm.size) : null,
    crop: farm.crop || undefined,
  });

  const handleDiagnosisAi = () => {
    handleAiConsultation(
      prompts.diagnosis,
      setDiagnosisAiResponse,
      setIsDiagnosisLoading
    );
  };

  const handleRequestsAi = () => {
    handleAiConsultation(
      prompts.request,
      setRequestsAiResponse,
      setIsRequestsLoading
    );
  };

  const handleAnalysisAi = () => {
    handleAiConsultation(
      prompts.analysis,
      setAnalysisAiResponse,
      setIsAnalysisLoading
    );
  };

  const handleSolutionAi = () => {
    handleAiConsultation(
      prompts.solution,
      setSolutionAiResponse,
      setIsSolutionLoading
    );
  };

  const handleSummaryAi = () => {
    handleAiConsultation(
      prompts.summary,
      setSummaryAiResponse,
      setIsSummaryLoading
    );
  };

  const handleQuestionAi = async () => {
    setIsQuestionLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: getQuestionPrompt({
                ...farm,
                size: farm.size ? Number(farm.size) : null,
                crop: farm.crop || undefined,
              }).suggestQuestions,
            },
            {
              role: "user",
              content: "질문을 추천해주세요.",
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const questions = data.choices[0].message.content
        .split("\n")
        .filter((line: string) => line.match(/^\d+\./))
        .map((line: string) => line.replace(/^\d+\.\s*/, ""));
      setSuggestedQuestions(questions);
    } catch (error) {
      console.error("OpenAI API 호출 중 오류 발생:", error);
      alert("질문 추천을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsQuestionLoading(false);
    }
  };

  const handleAddInterview = () => {
    if (currentQuestion && currentAnswer) {
      setInterviews([...interviews, { question: currentQuestion, answer: currentAnswer }]);
      setCurrentQuestion("");
      setCurrentAnswer("");
    }
  };

  // 환경 데이터 차트용 데이터
  const environmentalData = [
    { time: "00:00", temperature: 18, humidity: 60, co2: 700, light: 0 },
    { time: "03:00", temperature: 17, humidity: 65, co2: 750, light: 0 },
    { time: "06:00", temperature: 19, humidity: 70, co2: 800, light: 5000 },
    { time: "09:00", temperature: 23, humidity: 65, co2: 850, light: 12000 },
    { time: "12:00", temperature: 25, humidity: 60, co2: 900, light: 15000 },
    { time: "15:00", temperature: 24, humidity: 62, co2: 850, light: 13000 },
    { time: "18:00", temperature: 22, humidity: 68, co2: 800, light: 8000 },
    { time: "21:00", temperature: 20, humidity: 65, co2: 750, light: 2000 },
  ];

  // 관수 데이터 차트용 데이터
  const irrigationData = [
    { time: "00:00", supplyEC: 2.3, supplyPH: 6.1, drainEC: 2.5, drainPH: 6.3, moisture: 32 },
    { time: "03:00", supplyEC: 2.4, supplyPH: 6.2, drainEC: 2.6, drainPH: 6.3, moisture: 33 },
    { time: "06:00", supplyEC: 2.4, supplyPH: 6.2, drainEC: 2.7, drainPH: 6.4, moisture: 34 },
    { time: "09:00", supplyEC: 2.5, supplyPH: 6.2, drainEC: 2.8, drainPH: 6.4, moisture: 35 },
    { time: "12:00", supplyEC: 2.5, supplyPH: 6.2, drainEC: 2.8, drainPH: 6.4, moisture: 35 },
    { time: "15:00", supplyEC: 2.5, supplyPH: 6.2, drainEC: 2.8, drainPH: 6.4, moisture: 34 },
    { time: "18:00", supplyEC: 2.4, supplyPH: 6.2, drainEC: 2.7, drainPH: 6.3, moisture: 33 },
    { time: "21:00", supplyEC: 2.4, supplyPH: 6.1, drainEC: 2.6, drainPH: 6.3, moisture: 32 },
  ];

  if (!farm) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">농장 정보를 찾을 수 없습니다.</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <main className="container mx-auto px-4 pt-32 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">농장 기본정보</h1>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>농장명: {farm.name}</div>
              <div>농장주: {farm.owner_name}</div>
              <div>재배작물: {farm.crop || '-'}</div>
              <div>위치: {farm.location}</div>
              <div>면적: {farm.size ? `${farm.size}㎡` : '-'}</div>
              <div>최근 업데이트: {new Date(farm.updated_at).toLocaleDateString()}</div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
              <Button>컨설팅 시작하기</Button>
              <Button variant="outline">컨설팅 기록 보기</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
