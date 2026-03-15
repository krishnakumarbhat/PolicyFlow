import { cn } from '../../lib/utils';

export const Input = ({ className, ...props }) => (
  <input
    className={cn(
      'h-10 w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-zinc-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20',
      className,
    )}
    {...props}
  />
);