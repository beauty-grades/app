import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  className?: string
}

export const Paragraph = ({ children, className, ...rest }: ParagraphProps) => {
  return (
    <p
      className={cn("my-2 leading-7 dark:text-slate-300", className)}
      {...rest}
    >
      {children}
    </p>
  )
}

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4"
}

export const Heading = ({
  children,
  className,
  as = "h1",
  ...rest
}: HeadingProps) => {
  const HeadingTag = as

  const styles = {
    h1: "text-4xl font-extrabold lg:text-5xl mb-4",
    h2: "pb-2 mb-3 text-3xl font-semibold transition-colors first:mt-0 dark:border-b-slate-700",
    h3: "text-2xl font-semibold mb-2",
    h4: "text-xl font-semibold mb-1",
  }
  return (
    <HeadingTag
      className={cn("scroll-m-20 tracking-tight", styles[as], className)}
      {...rest}
    >
      <Balancer>{children}</Balancer>
    </HeadingTag>
  )
}
