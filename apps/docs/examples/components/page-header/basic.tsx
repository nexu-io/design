import { Button, PageHeader } from "@nexu-design/ui-web";

export function PageHeaderBasicExample() {
  return (
    <PageHeader
      title="Integrations"
      description="Manage all external services your workspace can connect to."
      actions={
        <>
          <Button variant="outline">Docs</Button>
          <Button>Add integration</Button>
        </>
      }
    />
  );
}
