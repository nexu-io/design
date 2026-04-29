import {
  ActivityBar,
  ActivityBarContent,
  ActivityBarFooter,
  ActivityBarHeader,
  ActivityBarIndicator,
  ActivityBarItem,
} from "@nexu-design/ui-web";

export function ActivityBarBasicExample() {
  return (
    <div className="h-[360px] overflow-hidden rounded-xl border border-border">
      <ActivityBar className="h-full">
        <ActivityBarHeader>
          <ActivityBarItem active aria-label="Home">
            <span className="text-sm">H</span>
            <ActivityBarIndicator />
          </ActivityBarItem>
        </ActivityBarHeader>
        <ActivityBarContent>
          <ActivityBarItem aria-label="Messages">
            <span className="text-sm">M</span>
          </ActivityBarItem>
          <ActivityBarItem aria-label="Billing">
            <span className="text-sm">B</span>
          </ActivityBarItem>
        </ActivityBarContent>
        <ActivityBarFooter>
          <ActivityBarItem aria-label="Settings">
            <span className="text-sm">S</span>
          </ActivityBarItem>
        </ActivityBarFooter>
      </ActivityBar>
    </div>
  );
}
