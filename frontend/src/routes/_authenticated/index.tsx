import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

async function getTotalSpent() {
  const response = await api.expenses["total-spent"].$get();
  if (!response.ok) {
    throw new Error("server error");
  }
  const data = await response.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Amount Spent</CardTitle>
          <CardDescription>The total amount spent by the user.</CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? <Skeleton className="h-4 w-20 " /> : data.total}
        </CardContent>
      </Card>
    </>
  );
}
