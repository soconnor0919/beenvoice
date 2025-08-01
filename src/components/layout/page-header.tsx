import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // For action buttons or other header content
  className?: string;
  variant?: "default" | "gradient" | "large" | "large-gradient";
  titleClassName?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className = "",
  variant = "default",
  titleClassName,
}: PageHeaderProps) {
  const getTitleClasses = () => {
    const baseClasses = "font-bold";

    switch (variant) {
      case "gradient":
        return `${baseClasses} text-3xl text-foreground`;
      case "large":
        return `${baseClasses} text-4xl text-foreground`;
      case "large-gradient":
        return `${baseClasses} text-4xl text-foreground`;
      default:
        return `${baseClasses} text-3xl text-foreground`;
    }
  };

  const getDescriptionSpacing = () => {
    return variant === "large" || variant === "large-gradient"
      ? "mt-2"
      : "mt-1";
  };

  return (
    <div className={`animate-fade-in-down mb-8 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="animate-fade-in-up space-y-1">
          <h1 className={titleClassName ?? getTitleClasses()}>{title}</h1>
          {description && (
            <p
              className={`animate-fade-in-up animate-delay-100 text-muted-foreground ${getDescriptionSpacing()} text-lg`}
            >
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="animate-slide-in-right animate-delay-200 flex flex-shrink-0 gap-2 sm:gap-3 [&>*]:h-8 [&>*]:px-2 [&>*]:text-sm sm:[&>*]:h-10 sm:[&>*]:px-4 sm:[&>*]:text-base [&>*>span]:hidden sm:[&>*>span]:inline [&>*>svg]:mr-0 sm:[&>*>svg]:mr-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// Convenience wrapper for dashboard page with larger gradient title
export function DashboardPageHeader({
  title,
  description,
  children,
  className = "",
}: Omit<PageHeaderProps, "variant">) {
  return (
    <PageHeader
      title={title}
      description={description}
      variant="large-gradient"
      className={className}
    >
      {children}
    </PageHeader>
  );
}
