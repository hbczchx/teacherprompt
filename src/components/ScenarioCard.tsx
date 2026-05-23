import { useNavigate } from 'react-router-dom';
import type { Scenario } from '../types';

interface Props {
  scenario: Scenario;
}

export default function ScenarioCard({ scenario }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/scenario/${scenario.id}`)}
      className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${scenario.color} text-left w-full`}
    >
      <span className="text-4xl">{scenario.icon}</span>
      <h3 className="text-lg font-semibold text-gray-800">{scenario.name}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{scenario.description}</p>
    </button>
  );
}
