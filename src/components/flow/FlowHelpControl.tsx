import { Controls, ControlButton } from 'reactflow';
import { Info } from 'lucide-react';

type FlowHelpControlProps = {
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

export function FlowHelpControl({
  setShowHelp,
  position = 'bottom-left',
}: FlowHelpControlProps) {
  return (
    <Controls position={position}>
      <ControlButton
        onClick={() => setShowHelp((prev) => !prev)}
        title="How to use this map"
      >
        <Info size={16} />
      </ControlButton>
    </Controls>
  );
}
