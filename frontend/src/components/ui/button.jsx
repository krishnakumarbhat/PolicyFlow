import { cn } from '../../lib/utils';

const variants = {
  primary:
    'bg-blue-500 text-white hover:bg-blue-400 focus-visible:outline-blue-300 shadow-lg shadow-blue-500/20',
  secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:outline-zinc-400',
  ghost: 'bg-transparent text-zinc-200 hover:bg-zinc-800/80 focus-visible:outline-zinc-400',
  outline:
    'border border-zinc-700 bg-zinc-950/70 text-zinc-100 hover:border-blue-400 hover:bg-zinc-900 focus-visible:outline-blue-300',
  danger: 'bg-red-500/90 text-white hover:bg-red-400 focus-visible:outline-red-300',
};

const sizes = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
};

export const Button = ({ className, variant = 'primary', size = 'md', ...props }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background-color,border-color,transform,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  />
);