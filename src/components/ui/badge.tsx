import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-800",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        destructive:
          "border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/80",
        inactive:
          "border-transparent bg-slate-500 text-neutral-50 hover:bg-slate-500/80 dark:bg-slate-500 dark:text-slate-50 dark:hover:bg-slate-500/80",
        active:
          "border-transparent bg-emerald-400 text-neutral-50 hover:bg-emerald-400/80 dark:bg-emerald-400 dark:text-emerald-50 dark:hover:bg-emerald-400/80",
        limited:
          "border-transparent bg-yellow-400 text-[#000000] hover:bg-yellow-400/80 dark:bg-yellow-400 dark:text-[#000000] dark:hover:bg-yellow-400/80",
        canceled:
          "border-transparent bg-amber-500 text-[#000000] hover:bg-amber-500/80 dark:bg-amber-500 dark:text-[#000000] dark:hover:bg-amber-500/80",
        outline: "text-neutral-950 dark:text-neutral-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
