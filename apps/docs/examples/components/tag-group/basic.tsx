import { TagGroup, TagGroupItem } from "@nexu-design/ui-web";

export function TagGroupBasicExample() {
  return (
    <TagGroup>
      <TagGroupItem variant="accent">AI</TagGroupItem>
      <TagGroupItem variant="accent">Slack</TagGroupItem>
      <TagGroupItem variant="success">Healthy</TagGroupItem>
      <TagGroupItem variant="warning">Needs review</TagGroupItem>
    </TagGroup>
  );
}
