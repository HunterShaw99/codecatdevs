import React from 'react';
import { useWidgetManager } from '@/app/context/widgetManager';
import {
    BackpackIcon,
    CursorArrowIcon,
    MixerHorizontalIcon,
    RulerHorizontalIcon,
    Share1Icon,
    TargetIcon,
    UploadIcon
} from "@radix-ui/react-icons"

const ICON_MAPPING : Record<string, any> = {
    analysis: BackpackIcon,
    click: CursorArrowIcon,
    settings: MixerHorizontalIcon,
    measure: RulerHorizontalIcon,
    route: Share1Icon,
    ring: TargetIcon,
    upload: UploadIcon
}

const WidgetButton: React.FC<{ id: string; label: string; iconType: string }> = ({ id, label, iconType }) => {
  const { isExpanded, toggle } = useWidgetManager();
  const expanded = isExpanded(id);
  const SelectedIcon = ICON_MAPPING[iconType]

  return (
    <button
      className={`widget-btn ${expanded ? 'btn-expanded' : 'btn-collapsed'}`}
      title={label}
      onClick={() => toggle(id)}
    >
      <SelectedIcon className={'w-8 h-8'}/>
    </button>
  );
};

export default WidgetButton;