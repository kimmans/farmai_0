import type { Route } from "../../+types/consulting";
import { useParams } from "react-router";
import Navigation from "~/common/components/navagation";
import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { Loader2 } from "lucide-react";
import { getFarmById } from "~/services/farm";

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
  const [gptQuestion, setGptQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleAiConsulting = async () => {
    if (!gptQuestion) {
      alert("질문을 입력해주세요.");
      return;
    }

    setIsLoading(true);
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
              content: `당신은 농업 컨설팅 전문가입니다. 다음 농장 정보를 바탕으로 컨설팅을 제공해주세요:
                농장명: ${farm.name}
                위치: ${farm.location}
                소유자: ${farm.owner_name}
                면적: ${farm.size || '정보 없음'}
                재배 작물: ${farm.crop || '정보 없음'}`,
            },
            {
              role: "user",
              content: gptQuestion,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      setAiResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("OpenAI API 호출 중 오류 발생:", error);
      alert("AI 컨설팅을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Farm Data Panel */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">농장 정보</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">농장명</h3>
                  <p className="text-lg">{farm.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">위치</h3>
                  <p className="text-lg">{farm.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">소유자</h3>
                  <p className="text-lg">{farm.owner_name}</p>
                </div>
                {farm.size && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">면적</h3>
                    <p className="text-lg">{farm.size}㎡</p>
                  </div>
                )}
                {farm.crop && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">재배 작물</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-primary/10 rounded-md text-sm">
                        {farm.crop}
                      </span>
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">최근 업데이트</h3>
                  <p className="text-lg">{new Date(farm.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Farm Photos Panel */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">농장 사진</h2>
              <div className="grid grid-cols-2 gap-4">
                <img src="/images/test_img1.png" alt="딸기 이미지 1" className="w-full h-auto rounded-lg object-contain" />
                <img src="/images/test_img2.png" alt="딸기 이미지 2" className="w-full h-auto rounded-lg object-contain" />
                <img src="/images/test_img3.png" alt="딸기 이미지 3" className="w-full h-auto rounded-lg object-contain" />
                <img src="/images/test_img4.png" alt="딸기 이미지 4" className="w-full h-auto rounded-lg object-contain" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Consulting Panel */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">컨설팅 작성</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">컨설팅 제목</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="컨설팅 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">컨설팅 내용</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2 border rounded-md min-h-[200px]"
                    placeholder="컨설팅 내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => {
                    setTitle("");
                    setContent("");
                  }}>
                    초기화
                  </Button>
                  <Button>
                    저장하기
                  </Button>
                </div>
              </div>
            </div>

            {/* GPT Consulting Panel */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">AI 컨설팅</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">질문하기</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2 border rounded-md min-h-[100px]"
                    placeholder="농장 운영에 대해 궁금한 점을 물어보세요"
                    value={gptQuestion}
                    onChange={(e) => setGptQuestion(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => {
                    setGptQuestion("");
                    setAiResponse("");
                  }}>
                    초기화
                  </Button>
                  <Button onClick={handleAiConsulting} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        AI 컨설팅 중...
                      </>
                    ) : (
                      "팜아이에게 묻기"
                    )}
                  </Button>
                </div>
                {aiResponse && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">AI 답변</h3>
                    <div className="prose prose-sm max-w-none">
                      {aiResponse.split("\n").map((line, index) => (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
