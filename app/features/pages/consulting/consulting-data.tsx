import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navigation from "~/common/components/navagation";
import { Card, CardHeader, CardContent, CardFooter } from "~/common/components/ui/card";
import ConsultingDataForm from "~/common/components/consulting-data-form";
import ConsultingStepper from "~/common/components/consulting-stepper";
import { Button } from "~/common/components/ui/button";

const steps = [
  { id: "environment", name: "환경 데이터" },
  { id: "irrigation", name: "관수 데이터" },
  { id: "growth", name: "생육 데이터" },
  { id: "pest", name: "병해충 데이터" },
  { id: "management", name: "경영 데이터" },
];

export default function ConsultingData() {
  const { farmId = "", dataType = "environment" } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepIdx = steps.findIndex(s => s.id === dataType);
  const isLastStep = currentStepIdx === steps.length - 1;

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Supabase 등 DB에 저장
    setTimeout(() => {
      setIsSubmitting(false);
      if (!isLastStep) {
        navigate(`/consulting/${farmId}/data/${steps[currentStepIdx + 1].id}`);
      } else {
        navigate(`/consulting/${farmId}/diagnosis`);
      }
    }, 500);
  };

  const handleSkip = () => {
    if (!isLastStep) {
      navigate(`/consulting/${farmId}/data/${steps[currentStepIdx + 1].id}`);
    } else {
      navigate(`/consulting/${farmId}/diagnosis`);
    }
  };

  const handlePrevious = () => {
    if (currentStepIdx > 0) {
      navigate(`/consulting/${farmId}/data/${steps[currentStepIdx - 1].id}`);
    } else {
      navigate(`/consulting/${farmId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />
      <main className="container mx-auto px-4 pt-32 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">농장 데이터 입력</h1>
            </CardHeader>
            <CardContent>
              <ConsultingStepper currentStep={dataType} steps={steps} />
              <ConsultingDataForm
                dataType={dataType}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={handlePrevious}>
                  이전
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  다음
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate(`/consulting/${farmId}/diagnosis`)}
              >
                건너뛰기
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
} 