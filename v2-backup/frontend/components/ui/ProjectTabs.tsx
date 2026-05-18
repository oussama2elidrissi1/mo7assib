export default function ProjectTabs({ tabs, activeTab, onChange }: { tabs: string[]; activeTab: number; onChange: (index: number) => void }) {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="inline-flex min-w-full gap-2 rounded-2xl border border-slate-200 bg-white p-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(index)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              index === activeTab ? "bg-primary-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
