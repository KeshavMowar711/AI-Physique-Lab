import type { AiReport } from "../types";

interface InsightsPanelProps {
  report: AiReport | null;
}

const EmptyState = () => (
  <div className="panel">
    <p className="eyebrow">AI Report</p>
    <h2>No analysis yet</h2>
    <p className="muted">
      Add your first check-in to generate training and diet suggestions.
    </p>
  </div>
);

export const InsightsPanel = ({ report }: InsightsPanelProps) => {
  if (!report) {
    return <EmptyState />;
  }

  return (
    <section className="panel">
      <p className="eyebrow">Latest AI Analysis</p>
      <h2>What changed</h2>
      <p>{report.summary}</p>

      <div className="insight-grid">
        <div>
          <h3>Changes observed</h3>
          <ul>
            {report.changesObserved.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Lagging muscles</h3>
          <ul>
            {report.laggingMuscles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Workout suggestions</h3>
          <ul>
            {report.workoutSuggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Diet suggestions</h3>
          <ul>
            {report.dietSuggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="muted">{report.confidenceNote}</p>
    </section>
  );
};