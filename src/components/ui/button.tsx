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
        default: 'px-4 py-2',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded px-8',
        sm: 'h-9 rounded px-3',
      },
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',

        // keep link so CMSLink appearance type includes "link"
        link: 'bg-transparent p-0 text-primary ',
        primary: [
          'group relative overflow-hidden rounded-none border-0 shadow-none',
          'px-[0.9rem] py-[0.6rem]',
          'bg-[#C2290E] text-white',
          'transition-colors duration-300',
          'hover:bg-white hover:text-black',
          'rounded-[3rem]',
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
  children,
  ref,
  ...props
}) => {
  const classes = cn(buttonVariants({ className, size, variant }))

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children as any}
      </Slot>
    )
  }

  return (
    <button className={classes} ref={ref} {...props}>
      {children}
    </button>
  )
}

export { Button, buttonVariants }
