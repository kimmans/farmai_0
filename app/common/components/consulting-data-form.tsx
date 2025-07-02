import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";

// getUserMedia 기반 카메라 촬영 모달 컴포넌트
function CameraCapture({ onCapture, onClose }: { onCapture: (file: File) => void, onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 카메라 시작
  const startCamera = async () => {
    const s = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(s);
    if (videoRef.current) {
      videoRef.current.srcObject = s;
      videoRef.current.play();
    }
  };

  // 사진 촬영
  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          onCapture(file);
        }
      }, "image/jpeg");
    }
  };

  // 카메라 종료
  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    onClose();
  };

  // 카메라 자동 시작
  React.useEffect(() => {
    startCamera();
    return stopCamera;
    // eslint-disable-next-line
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
      <video ref={videoRef} className="rounded shadow-lg" autoPlay playsInline style={{ width: 400, maxWidth: "90vw" }} />
      <div className="flex gap-2 mt-4">
        <button onClick={handleCapture} className="px-4 py-2 bg-blue-600 text-white rounded">촬영</button>
        <button onClick={stopCamera} className="px-4 py-2 bg-gray-300 rounded">닫기</button>
      </div>
    </div>
  );
}

interface ConsultingDataFormProps {
  dataType: string;
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const dataFields: Record<string, { name: string; label: string; type: string }[]> = {
  environment: [
    { name: "weekly_temp", label: "주간온도 (°C)", type: "number" },
    { name: "nightly_temp", label: "야간온도 (°C)", type: "number" },
    { name: "humidity", label: "습도 (%)", type: "number" },
    { name: "co2_concentration", label: "CO2 농도 (ppm)", type: "number" },
    { name: "light_intensity", label: "광량 (lux)", type: "number" },
    { name: "external_temp", label: "외부온도 (°C)", type: "number" },
    { name: "weather", label: "날씨", type: "text" },
  ],
  irrigation: [
    { name: "supply_ec", label: "공급 EC (mS/cm)", type: "number" },
    { name: "supply_ph", label: "공급 pH", type: "number" },
    { name: "drainage_ec", label: "배액 EC (mS/cm)", type: "number" },
    { name: "drainage_ph", label: "배액 pH", type: "number" },
    { name: "moisture_content", label: "함수율 (%)", type: "number" },
    { name: "supply_amount", label: "공급량 (L)", type: "number" },
    { name: "drainage_amount", label: "배액량 (L)", type: "number" },
  ],
  growth: [
    { name: "description", label: "설명", type: "textarea" },
  ],
  pest: [
    { name: "description", label: "설명", type: "textarea" },
  ],
  management: [
    { name: "production_amount", label: "생산량 (kg)", type: "number" },
    { name: "sales_amount", label: "판매량 (kg)", type: "number" },
    { name: "sales_revenue", label: "판매금액 (원)", type: "number" },
    { name: "production_cost", label: "생산비용 (원)", type: "number" },
    { name: "period", label: "기간", type: "text" },
    { name: "notes", label: "특이사항", type: "textarea" },
  ],
};

export default function ConsultingDataForm({ dataType, formData, onChange, onSubmit, isSubmitting }: ConsultingDataFormProps) {
  const fields = dataFields[dataType] || [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  // 사진 미리보기용 URL 생성
  const photoUrl = formData.photo ? (typeof formData.photo === "string" ? formData.photo : URL.createObjectURL(formData.photo)) : null;

  // 사진 입력 UI: growth, pest 단계에서만 노출
  const showPhotoInput = dataType === "growth" || dataType === "pest";

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-4">
      {fields.map(field => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              value={formData[field.name] || ""}
              onChange={e => onChange(field.name, e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={`${field.label}을 입력하세요`}
            />
          ) : (
            <Input
              id={field.name}
              type={field.type}
              value={formData[field.name] || ""}
              onChange={e => onChange(field.name, e.target.value)}
              placeholder={`${field.label}을 입력하세요`}
            />
          )}
        </div>
      ))}

      {showPhotoInput && (
        <div className="space-y-2">
          <Label>사진 첨부</Label>
          <div className="flex gap-2 items-center">
            {/* 사진 업로드용 input (파일 선택) */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  onChange("photo", e.target.files[0]);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCamera(true)}
            >
              사진 촬영
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              사진 업로드
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            사진을 촬영하거나 업로드하면 아래에 미리보기가 표시됩니다.
          </div>
          {photoUrl && (
            <img src={photoUrl} alt="미리보기" className="mt-2 w-32 h-32 object-cover rounded border" />
          )}
        </div>
      )}

      {showCamera && (
        <CameraCapture
          onCapture={file => {
            onChange("photo", file);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        {isSubmitting ? "저장 중..." : "다음"}
      </Button>
    </form>
  );
} 