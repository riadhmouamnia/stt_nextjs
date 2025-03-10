import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopicsCardProps {
  topics: string[];
}

export function TopicsCard({ topics }: TopicsCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-pink-500 lg:text-4xl text-2xl">
          Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 rounded-full px-4 py-1"
            >
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
