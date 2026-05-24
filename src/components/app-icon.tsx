import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

export function AppIcon({
  icon,
  className,
  size = 18,
}: {
  icon: IconSvgElement;
  className?: string;
  size?: number;
}) {
  return (
    <HugeiconsIcon
      aria-hidden="true"
      className={className}
      color="currentColor"
      icon={icon}
      size={size}
      strokeWidth={1.7}
    />
  );
}
