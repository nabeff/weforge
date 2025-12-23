import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded px-8',
        sm: 'h-9 rounded px-3',
      },
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-card hover:text-accent-foreground',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline',
        outline: 'border border-border bg-background hover:bg-card hover:text-accent-foreground',

        // ✅ NEW: CMS "Link" appearance (no bg)
        cmsLink:
          'bg-transparent p-0 text-[#8E8E8E] hover:text-white underline-offset-4 hover:underline',

        primary: [
          'relative overflow-hidden rounded-none',
          'px-4 py-[0.8rem]', // ← if you want EXACT 1rem X padding, replace px-4 with px-[1rem]
          'px-[1rem] py-[0.8rem]',
          'bg-[#C2290E] text-white',
          'transition-colors duration-200',
          'before:content-[""] before:absolute before:inset-0 before:bg-white',
          'before:translate-y-full',
          // ✅ faster (was 500)
          'before:transition-transform before:duration-300 before:ease-in',
          'hover:before:translate-y-0',
          'z-0',
          'hover:text-black',
        ].join(' '),

        // ✅ Secondary button (bg white, wipe to #C2290E)
        secondary: [
          'relative overflow-hidden rounded-none',
          'px-[1rem] py-[0.8rem]',
          'bg-white text-black',
          'transition-colors duration-200',
          'before:content-[""] before:absolute before:inset-0 before:bg-[#C2290E]',
          'before:translate-y-full',
          // ✅ faster
          'before:transition-transform before:duration-300 before:ease-in',
          'hover:before:translate-y-0',
          'z-0',
          'hover:text-white',
        ].join(' '),
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  ref,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
}

export { Button, buttonVariants }
