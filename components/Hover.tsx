import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface HoverCardProps {
  children: React.ReactNode;
  description?: string;
  contentSize?: string;
  side?: "left" | "right" | "top" | "bottom";
  isCollapsed?: boolean;
}

const Hover = ({
  children,
  description,
  contentSize,
  side = "bottom",
  isCollapsed = false,
}: HoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        className={`${contentSize} rounded-xl transition-all duration-300 ${
          isCollapsed ? "translate-x-2" : "translate-x-0"
        }`}
        sideOffset={isCollapsed ? 10 : 5}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-sm">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Hover;
