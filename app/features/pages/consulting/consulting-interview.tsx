import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Navigation from "~/common/components/navagation";
import { Card, CardHeader, CardContent, CardFooter } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { getRecommendedQuestions, transcribeAudio } from "../../../services/interview";
import { loadStrawberryManualYaml, loadPreviousConsultingReports } from "../../../lib/yaml-loader";
import { getFarmById } from "../../../services/farm";
import { saveInterviewData, getDiagnosisData } from "../../../services/consulting";

export default function ConsultingInterview() {
  const { farmId = "" } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<{ id: string; question: string; reason: string }[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [interviews, setInterviews] = useState<{ question: string; answer: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [farmData, setFarmData] = useState<any>(null);
  const [diagnosisData, setDiagnosisData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 농장 데이터 및 진단 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const [farmDataResult, diagnosisDataResult] = await Promise.all([
          getFarmById(farmId),
          getDiagnosisData(farmId)
        ]);
        setFarmData(farmDataResult);
        setDiagnosisData(diagnosisDataResult);
      } catch (e) {
        console.error("데이터 로드 실패:", e);
        setError("데이터를 불러올 수 없습니다.");
      }
    };
    if (farmId) {
      loadData();
    }
  }, [farmId]);

  // 질문 추천 (GPT)
  const handleQuestionRecommendation = async () => {
    setIsLoadingRecommendations(true);
    setShowRecommendations(true);
    setError("");
    
    try {
      const yaml = await loadStrawberryManualYaml();
      const previousReports = await loadPreviousConsultingReports(farmId);
      
      if (!farmData) {
        throw new Error("농장 데이터가 없습니다.");
      }
      
      const questions = await getRecommendedQuestions(farmData, yaml, previousReports, diagnosisData);
      setRecommendedQuestions(questions);
    } catch (e) {
      console.error("질문 추천 실패:", e);
      setError("질문 추천 중 오류가 발생했습니다. 다시 시도해주세요.");
      setRecommendedQuestions([
        { id: "rec1", question: "최근 생육 상태에서 가장 신경 쓰이는 점은?", reason: "생육 데이터 기반" },
        { id: "rec2", question: "관수 관리에서 어려운 점은?", reason: "관수 데이터 기반" },
        { id: "rec3", question: "병해충 방제에 대해 궁금한 점은?", reason: "병해충 데이터 기반" },
      ]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // 녹음/Whisper
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setIsTranscribing(true);
        try {
          const result = await transcribeAudio(audioBlob);
          if (result.success) setCurrentAnswer(result.text);
        } finally {
          setIsTranscribing(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      alert("마이크 접근 권한이 필요합니다.");
    }
  };
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAddInterview = () => {
    if (currentQuestion && currentAnswer) {
      setInterviews(prev => [...prev, { question: currentQuestion, answer: currentAnswer }]);
      setCurrentQuestion("");
      setCurrentAnswer("");
      setShowRecommendations(false);
    }
  };

  const handleFinishInterview = async () => {
    if (interviews.length === 0) {
      alert("최소 1개 이상의 인터뷰를 추가해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      // 인터뷰 데이터 저장
      await saveInterviewData(farmId, interviews);
      console.log("인터뷰 데이터 저장 완료:", interviews);
      
      // 보고서 페이지로 이동
      navigate(`/consulting/${farmId}/report`);
    } catch (e) {
      console.error("인터뷰 저장 실패:", e);
      setError("인터뷰 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <main className="container mx-auto px-4 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 인터뷰 진행 영역 */}
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">인터뷰 진행</h1>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {/* 질문 추천 */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" onClick={handleQuestionRecommendation} disabled={isLoadingRecommendations}>
                    {isLoadingRecommendations ? "추천 중..." : "질문 추천"}
                  </Button>
                  {showRecommendations && (
                    <Button variant="ghost" onClick={handleQuestionRecommendation} disabled={isLoadingRecommendations}>
                      {isLoadingRecommendations ? "추천 중..." : "다시 추천"}
                    </Button>
                  )}
                </div>
                
                {diagnosisData && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                    <div className="font-medium mb-1">📊 진단 결과 참조</div>
                    <div>진단 결과를 바탕으로 맞춤형 질문을 추천합니다.</div>
                  </div>
                )}
                
                {showRecommendations && recommendedQuestions.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {recommendedQuestions.map((rec) => (
                      <Card key={rec.id} className="p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-medium mb-1">{rec.question}</div>
                          <div className="text-xs text-muted-foreground mb-2">{rec.reason}</div>
                        </div>
                        <Button size="sm" onClick={() => { setCurrentQuestion(rec.question); setShowRecommendations(false); }}>
                          선택
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* 질문 입력 */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">질문</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="질문을 입력하거나 추천을 선택하세요"
                  value={currentQuestion}
                  onChange={e => setCurrentQuestion(e.target.value)}
                />
              </div>

              {/* 답변 입력 */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">답변</label>
                <div className="flex gap-2 items-start">
                  <textarea
                    className="flex-1 border rounded px-3 py-2 min-h-[100px] resize-none"
                    placeholder="답변을 입력하세요"
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    {!isRecording ? (
                      <Button variant="outline" onClick={handleStartRecording} disabled={isTranscribing} size="sm">
                        {isTranscribing ? "변환 중..." : "🎤"}
                      </Button>
                    ) : (
                      <Button variant="destructive" onClick={handleStopRecording} size="sm">
                        ⏹️
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <Button onClick={handleAddInterview} disabled={!currentQuestion || !currentAnswer}>
                  인터뷰 추가
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleFinishInterview} 
                  disabled={interviews.length === 0 || isSaving}
                >
                  {isSaving ? "저장 중..." : "인터뷰 마치기"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 오른쪽: 인터뷰 기록 */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">인터뷰 기록</h2>
              <p className="text-sm text-muted-foreground">
                총 {interviews.length}개의 인터뷰가 기록되었습니다.
              </p>
            </CardHeader>
            <CardContent>
              {interviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">📝</div>
                  <div>아직 인터뷰가 없습니다.</div>
                  <div className="text-sm">왼쪽에서 인터뷰를 진행해보세요.</div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {interviews.map((interview, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-2">Q. {interview.question}</div>
                          <div className="text-sm text-muted-foreground">A. {interview.answer}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 