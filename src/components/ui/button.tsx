import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap text-sm',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
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

        // ✅ keep link so CMSLink appearance type includes "link"
        link: 'bg-transparent p-0 text-primary underline-offset-4 hover:underline',

        // PRIMARY (slow + smooth)
        // - base surface = white tiles
        // - underlay = orange (#C2290E)
        // - text = black → white on hover
        primary: [
          'group',
          'relative overflow-hidden rounded-none',
          'px-4 py-[0.5rem]',

          // slow text change too (no pop)
          'bg-transparent text-black hover:text-white',
          'transition-colors duration-[1400ms] ease-[cubic-bezier(0.20,0.00,0.20,1.00)]',

          // remove artifacts
          'border-0 outline-none ring-0 shadow-none',
          'focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',

          // orange underlay revealed as tiles leave
          'before:content-[""] before:absolute before:inset-0 before:bg-[#C2290E] before:z-0',
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

const Tiles: React.FC = () => {
  // Ultra-smooth + ultra-slow
  const easing = 'ease-[cubic-bezier(0.22,0.00,0.10,1.00)]'

  const tileBase = [
    'absolute w-1/2 h-1/2 bg-white z-10',
    'will-change-transform',
    'transition-transform',
    'duration-[3000ms]', // <-- slower
    easing,
  ].join(' ')

  return (
    <span className="absolute inset-0 z-0 pointer-events-none">
      <span
        className={`${tileBase} top-0 left-0 group-hover:-translate-x-12 group-hover:-translate-y-12`}
      />
      <span
        className={`${tileBase} top-0 right-0 group-hover:translate-x-12 group-hover:-translate-y-12`}
      />
      <span
        className={`${tileBase} bottom-0 left-0 group-hover:-translate-x-12 group-hover:translate-y-12`}
      />
      <span
        className={`${tileBase} bottom-0 right-0 group-hover:translate-x-12 group-hover:translate-y-12`}
      />
    </span>
  )
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  children,
  ref,
  ...props
}) => {
  const classes = cn(buttonVariants({ className, size, variant }))

  // Slot must receive exactly one child element
  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        <span className="relative inline-flex items-center justify-center">
          {variant === 'primary' && <Tiles />}
          <span className="relative z-20">{children}</span>
        </span>
      </Slot>
    )
  }

  return (
    <button className={classes} ref={ref} {...props}>
      {variant === 'primary' && <Tiles />}
      <span className="relative z-20">{children}</span>
    </button>
  )
}

export { Button, buttonVariants }
