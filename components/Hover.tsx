import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface HoverCardProps {
  children: React.ReactNode;
  description?: string;
  contentSize?: string;
}

const Hover = ({ children, description, contentSize }: HoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </HoverCardTrigger>
      <HoverCardContent className={contentSize}>
        <div className="flex items-center justify-center h-full">
          <p className="text-sm">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Hover;
