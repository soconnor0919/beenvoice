import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: { width: 120, height: 32 },
    md: { width: 160, height: 42 },
    lg: { width: 240, height: 64 },
  };
  const { width, height } = sizeClasses[size];

  return (
    <Image
      src="/beenvoice-logo.svg"
      alt="beenvoice logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
