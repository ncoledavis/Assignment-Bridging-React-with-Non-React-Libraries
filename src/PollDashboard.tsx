import { useState, useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the Chart.js components we need for a bar chart
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// The poll options for "Favorite JavaScript Framework"
const FRAMEWORKS = ["React", "Vue", "Angular", "Svelte", "Solid"];

// Gradient-friendly colors for the dark theme
const BAR_COLORS = [
  "rgba(97, 218, 251, 0.8)",  // React cyan
  "rgba(66, 211, 146, 0.8)",  // Vue green
  "rgba(255, 68, 93, 0.8)",   // Angular red-pink
  "rgba(255, 135, 50, 0.8)",  // Svelte orange
  "rgba(99, 102, 241, 0.8)",  // Solid indigo
];

const BAR_BORDERS = [
  "rgba(97, 218, 251, 1)",
  "rgba(66, 211, 146, 1)",
  "rgba(255, 68, 93, 1)",
  "rgba(255, 135, 50, 1)",
  "rgba(99, 102, 241, 1)",
];

function PollDashboard() {
  // React state holding the vote count for each framework
  const [votes, setVotes] = useState<number[]>([0, 0, 0, 0, 0]);

  // Ref to the <canvas> DOM element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ref to hold the imperative Chart.js instance (not managed by React rendering)
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    // --- Imperative Instantiation ---
    // If no chart instance exists yet, create one on the canvas ref.
    // This is the "escape hatch": we step outside React's declarative model
    // to imperatively control a vanilla JS library via a DOM node.
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = new Chart(canvasRef.current!, {
        type: "bar",
        data: {
          labels: FRAMEWORKS,
          datasets: [
            {
              label: "Votes",
              data: votes,
              backgroundColor: BAR_COLORS,
              borderColor: BAR_BORDERS,
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 400,
            easing: "easeOutQuart",
          },
          plugins: {
            title: {
              display: true,
              text: "Live Results",
              font: { size: 16, weight: "bold" },
              color: "#f1f5f9",
              padding: { bottom: 20 },
            },
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "#1e293b",
              titleColor: "#f1f5f9",
              bodyColor: "#94a3b8",
              borderColor: "#334155",
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: "#94a3b8",
                font: { size: 12 },
              },
              title: {
                display: true,
                text: "Votes",
                color: "#94a3b8",
                font: { size: 13 },
              },
              grid: {
                color: "rgba(51, 65, 85, 0.5)",
              },
              border: {
                color: "#334155",
              },
            },
            x: {
              ticks: {
                color: "#f1f5f9",
                font: { size: 13, weight: "bold" },
              },
              title: {
                display: true,
                text: "Framework",
                color: "#94a3b8",
                font: { size: 13 },
              },
              grid: {
                display: false,
              },
              border: {
                color: "#334155",
              },
            },
          },
        },
      });
    } else {
      // --- State Synchronization ---
      // The chart already exists. Instead of recreating it, mutate its
      // internal data array and call the imperative .update() method so
      // Chart.js re-renders the bars with the latest vote counts.
      chartInstanceRef.current.data.datasets[0].data = votes;
      chartInstanceRef.current.update();
    }

    // Running new Chart() on every state render without destroying the previous
    // instance causes canvas rendering errors. Chart.js binds event listeners and
    // internal animation frames to the canvas context. Creating a duplicate instance
    // on the same canvas results in overlapping bindings, corrupted draw calls, and
    // "Canvas is already in use" errors from the library.

    // --- The Cleanup Execution ---
    return () => {
      // Destroy the Chart.js instance to detach all event listeners, clear the
      // canvas, and free the internal animation/rendering resources. This prevents
      // memory leaks on unmount and avoids conflicts if the effect re-runs.
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [votes]);

  // Handler to increment the vote count for a given framework index
  const handleVote = (index: number) => {
    setVotes((prev) => {
      const updated = [...prev];
      updated[index] += 1;
      return updated;
    });
  };

  const totalVotes = votes.reduce((sum, v) => sum + v, 0);

  return (
    <div className="poll-dashboard">
      <div className="vote-buttons">
        <h2>Cast Your Vote</h2>
        <div className="buttons-row">
          {FRAMEWORKS.map((framework, index) => (
            <button
              key={framework}
              className="vote-btn"
              onClick={() => handleVote(index)}
              aria-label={`Vote for ${framework}`}
            >
              {framework}
              <span className="count">{votes[index]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <canvas ref={canvasRef} aria-label="Poll results bar chart" role="img" />
      </div>

      <p className="total-votes">
        Total votes: <span>{totalVotes}</span>
      </p>
    </div>
  );
}

export default PollDashboard;
