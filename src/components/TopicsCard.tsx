import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface TopicsCardProps {
  topics: string[] | undefined;
  isLoading: boolean;
}

export function TopicsCard({ topics, isLoading }: TopicsCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-pink-500 lg:text-4xl text-2xl">
          Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-8 rounded-full w-[80px] bg-zinc-800"
              />
            ))}
          {topics?.map((topic, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 rounded-full px-4 py-1"
            >
              {topic}
            </Badge>
          ))}
          {topics?.length === 0 && !isLoading && (
            <Badge
              variant="outline"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 rounded-full px-4 py-1"
            >
              No topics
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
