import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

const ComingSoon = ({ title, desc }: { title: string; desc: string }) => (
  <div>
    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
    <Card className="p-8 mt-6 text-center">
      <Construction className="h-10 w-10 text-primary mx-auto mb-3" />
      <h2 className="font-bold text-lg">Building this section next</h2>
      <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">{desc}</p>
    </Card>
  </div>
);

export default ComingSoon;
