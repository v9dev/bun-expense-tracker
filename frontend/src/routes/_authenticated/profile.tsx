import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if (isPending) return "loading";
  if (error) return "User not logged in";
  return (
    <div className="p-2">
      Hello from Profile!
      <Avatar>
        {data.user.picture && (
          <AvatarImage src={data.user.picture} alt={data.user.given_name} />
        )}
        <AvatarFallback>{data.user.given_name}</AvatarFallback>
      </Avatar>
      <p>Hello {data.user.given_name}</p>
      <Button asChild className="my-4">
        <a href="/api/logout">Logout</a>
      </Button>
    </div>
  );
}
