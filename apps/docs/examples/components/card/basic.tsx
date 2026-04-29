import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nexu-design/ui-web";

export function CardBasicExample() {
  return (
    <Card className="w-full max-w-sm" variant="static">
      <CardHeader>
        <CardTitle>Project usage</CardTitle>
        <CardDescription>Track the monthly design system adoption target.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold text-text-heading">72%</p>
        <p className="text-sm text-text-secondary">12 points higher than last month.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Open report</Button>
        <Button size="sm" variant="outline">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
