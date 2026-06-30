import { useEffect, useState } from 'react';
import AdSlot from './AdSlot';

export interface ResponsiveAdSize {
  media?: string;
  width?: number;
  height?: number;
  disabled?: boolean;
}

interface ResponsiveAdSlotProps {
  sizes: ResponsiveAdSize[];
  label?: string;
  placement?: string;
  className?: string;
  priority?: boolean;
  sticky?: boolean;
}

function selectSize(sizes: ResponsiveAdSize[]) {
  if (typeof window === 'undefined') return sizes[sizes.length - 1];
  return sizes.find((size) => !size.media || window.matchMedia(size.media).matches) ?? sizes[sizes.length - 1];
}

export default function ResponsiveAdSlot({
  sizes,
  label,
  placement,
  className = '',
  priority = false,
  sticky = false,
}: ResponsiveAdSlotProps) {
  const [size, setSize] = useState(() => selectSize(sizes));

  useEffect(() => {
    const updateSize = () => setSize(selectSize(sizes));
    const queries = sizes
      .filter((candidate): candidate is ResponsiveAdSize & { media: string } => Boolean(candidate.media))
      .map((candidate) => window.matchMedia(candidate.media));

    updateSize();
    queries.forEach((query) => query.addEventListener('change', updateSize));
    return () => queries.forEach((query) => query.removeEventListener('change', updateSize));
  }, [sizes]);

  if (size.disabled || !size.width || !size.height) return null;

  return (
    <AdSlot
      width={size.width}
      height={size.height}
      label={label}
      placement={placement}
      className={className}
      priority={priority}
      sticky={sticky}
    />
  );
}
