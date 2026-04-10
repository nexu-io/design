import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../primitives/tabs";

const UnderlineTabs = Tabs;
const UnderlineTabsContent = TabsContent;

const UnderlineTabsList = React.forwardRef<
  React.ComponentRef<typeof TabsList>,
  Omit<React.ComponentPropsWithoutRef<typeof TabsList>, "variant">
>(({ ...props }, ref) => <TabsList ref={ref} variant="default" {...props} />);

UnderlineTabsList.displayName = "UnderlineTabsList";

const UnderlineTabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsTrigger>,
  Omit<React.ComponentPropsWithoutRef<typeof TabsTrigger>, "variant">
>(({ ...props }, ref) => <TabsTrigger ref={ref} variant="default" {...props} />);

UnderlineTabsTrigger.displayName = "UnderlineTabsTrigger";

export { UnderlineTabs, UnderlineTabsContent, UnderlineTabsList, UnderlineTabsTrigger };
