"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nexu-design/ui-web";

export function TabsBasicExample() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="rounded-lg border border-border-subtle bg-card p-4 text-sm text-text-secondary">
          Review project health, owners, and the next milestone in one place.
        </p>
      </TabsContent>
      <TabsContent value="activity">
        <p className="rounded-lg border border-border-subtle bg-card p-4 text-sm text-text-secondary">
          Recent deploys, comments, and status changes appear here.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="rounded-lg border border-border-subtle bg-card p-4 text-sm text-text-secondary">
          Configure notifications and access rules for this project.
        </p>
      </TabsContent>
    </Tabs>
  );
}
