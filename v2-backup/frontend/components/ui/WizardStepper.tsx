export default function WizardStepper({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-6">
      {steps.map((step, index) => {
        const active = index === currentStep;
        const done = index < currentStep;
        return (
          <div
            key={step}
            className={`rounded-2xl border p-4 text-sm ${
              active
                ? "border-primary-300 bg-primary-50 text-primary-900"
                : done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            <p className="mb-1 text-xs font-semibold">المرحلة {index + 1}</p>
            <p className="font-medium">{step}</p>
          </div>
        );
      })}
    </div>
  );
}
