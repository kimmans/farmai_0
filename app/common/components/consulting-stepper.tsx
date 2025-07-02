interface ConsultingStepperProps {
  currentStep: string;
  steps: { id: string; name: string }[];
}

export default function ConsultingStepper({ currentStep, steps }: ConsultingStepperProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <div className={`px-4 py-2 rounded ${currentStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            <span className="text-sm font-medium">{step.name}</span>
          </div>
          {idx < steps.length - 1 && <div className="w-8 h-0.5 bg-muted mx-2" />}
        </div>
      ))}
    </div>
  );
} 