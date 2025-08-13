import PersonalityTestHeader from './PersonalityTestHeader';
import PersonalityTestBody from './PersonalityTestBody';
import PersonalityTestFlow from './PersonalityTestFlow';

export default function PersonalityTestPage() {
  return (
    <div className="min-h-screen bg-white">
      <PersonalityTestHeader />
      <PersonalityTestBody />
      <PersonalityTestFlow />
    </div>
  );
}