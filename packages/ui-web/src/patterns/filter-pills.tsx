import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../primitives/tabs";

const FilterPills = Tabs;
const FilterPillsContent = TabsContent;

const FilterPillsList = React.forwardRef<
  React.ComponentRef<typeof TabsList>,
  Omit<React.ComponentPropsWithoutRef<typeof TabsList>, "variant">
>(({ ...props }, ref) => <TabsList ref={ref} variant="default" {...props} />);

FilterPillsList.displayName = "FilterPillsList";

const FilterPillTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsTrigger>,
  Omit<React.ComponentPropsWithoutRef<typeof TabsTrigger>, "variant">
>(({ ...props }, ref) => <TabsTrigger ref={ref} variant="default" {...props} />);

FilterPillTrigger.displayName = "FilterPillTrigger";

export { FilterPills, FilterPillsContent, FilterPillsList, FilterPillTrigger };
