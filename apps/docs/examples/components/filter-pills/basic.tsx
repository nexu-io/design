import {
  Card,
  CardContent,
  FilterPillTrigger,
  FilterPills,
  FilterPillsContent,
  FilterPillsList,
} from "@nexu-design/ui-web";

export function FilterPillsBasicExample() {
  return (
    <FilterPills defaultValue="plus" className="w-[420px]">
      <FilterPillsList className="mb-4">
        <FilterPillTrigger value="free">Free</FilterPillTrigger>
        <FilterPillTrigger value="plus">Plus</FilterPillTrigger>
        <FilterPillTrigger value="pro">Pro</FilterPillTrigger>
      </FilterPillsList>
      <FilterPillsContent value="free">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Shared queue and starter credits.
          </CardContent>
        </Card>
      </FilterPillsContent>
      <FilterPillsContent value="plus">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Solo plan with faster queue priority.
          </CardContent>
        </Card>
      </FilterPillsContent>
      <FilterPillsContent value="pro">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Higher caps and advanced automation.
          </CardContent>
        </Card>
      </FilterPillsContent>
    </FilterPills>
  );
}
