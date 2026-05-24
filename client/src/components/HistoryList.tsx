import type { CheckIn } from "../types";

interface HistoryListProps {
  history?: CheckIn[]; // Added '?' so it handles undefined history safely
}

export const HistoryList = ({ history }: HistoryListProps) => {
  return (
    <section className="panel reveal reveal-delay-2">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Timeline</p>
          <h2>Recent check-ins</h2>
        </div>
      </div>

      <div className="history-list">
        {/* We use a ternary ( ? : ) here because we are inside JSX */}
        {!history || history.length === 0 ? (
          <p className="muted">No check-ins yet. Start your journey!</p>
        ) : (
          history.map((entry) => (
            <article 
              className="history-item" 
              key={entry._id ?? `${entry.date}-${entry.weightKg}`}
            >
              <div>
                <strong>{new Date(entry.date).toLocaleDateString()}</strong>
                <p className="muted">
                  <span className="capitalize">{entry.goal}</span> • {entry.weightKg} kg
                </p>
              </div>
              <p>{entry.aiReport?.summary ?? "AI report pending."}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
};