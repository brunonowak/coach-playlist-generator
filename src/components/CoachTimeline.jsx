import { useMemo } from 'react';

function CoachTimeline({ seasons }) {
  const { coaches, seasonLabels } = useMemo(() => {
    const coachMap = new Map();

    seasons.forEach((s, idx) => {
      s.coaches.forEach(name => {
        if (!coachMap.has(name)) {
          coachMap.set(name, { name, firstIndex: idx, seasonSet: new Set() });
        }
        coachMap.get(name).seasonSet.add(s.season);
      });
    });

    const sorted = Array.from(coachMap.values()).sort((a, b) => {
      if (a.firstIndex !== b.firstIndex) return a.firstIndex - b.firstIndex;
      return b.seasonSet.size - a.seasonSet.size;
    });

    return {
      coaches: sorted,
      seasonLabels: seasons.map(s => s.season),
    };
  }, [seasons]);

  if (!seasons.length) return null;

  return (
    <div className="timeline-wrapper">
      <div className="timeline-scroll">
        <div
          className="timeline-grid"
          style={{ gridTemplateColumns: `140px repeat(${seasonLabels.length}, 1fr)` }}
        >
          {/* Header row */}
          <div className="timeline-corner" />
          {seasonLabels.map(label => (
            <div key={label} className="timeline-header-cell">
              {label}
            </div>
          ))}

          {/* Coach rows */}
          {coaches.map(coach => (
            <Row
              key={coach.name}
              coach={coach}
              seasons={seasons}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ coach, seasons }) {
  return (
    <>
      <div className="timeline-label">{coach.name}</div>
      {seasons.map(s => {
        const active = coach.seasonSet.has(s.season);
        return (
          <div key={s.season} className="timeline-cell">
            {active && (
              <div
                className="timeline-block"
                title={`${coach.name} — S${s.season} (${s.year})`}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

export default CoachTimeline;
