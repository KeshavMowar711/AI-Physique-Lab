import type { DashboardResponse } from "../types";

interface ProgressOverviewProps {
  dashboard: DashboardResponse | null;
}

export const ProgressOverview = ({ dashboard }: ProgressOverviewProps) => {
  const overview = dashboard?.overview;
  const comparison = dashboard?.comparison;

  return (
    <section className="stats-grid">
      <article className="stat-card">
        <span className="stat-label">Check-ins</span>
        <strong>{overview?.totalCheckIns ?? 0}</strong>
      </article>
      <article className="stat-card">
        <span className="stat-label">Latest weight</span>
        <strong>
          {overview?.latestWeightKg !== null && overview?.latestWeightKg !== undefined
            ? `${overview.latestWeightKg} kg`
            : "--"}
        </strong>
      </article>
      <article className="stat-card">
        <span className="stat-label">Goal</span>
        <strong className="capitalize">{overview?.currentGoal ?? "--"}</strong>
      </article>
      <article className="stat-card">
        <span className="stat-label">Weight delta</span>
        <strong>
          {comparison ? `${comparison.weightDeltaKg > 0 ? "+" : ""}${comparison.weightDeltaKg} kg` : "--"}
        </strong>
      </article>
    </section>
  );
};