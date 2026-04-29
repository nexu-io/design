import { Alert, AlertDescription, AlertTitle } from "@nexu-design/ui-web";

export function AlertBasicExample() {
  return (
    <Alert variant="warning" className="max-w-lg">
      <span aria-hidden="true" className="text-base leading-none">
        ⚠
      </span>
      <div>
        <AlertTitle>Action required</AlertTitle>
        <AlertDescription>
          Two integrations need re-authentication before the next release can start.
        </AlertDescription>
      </div>
    </Alert>
  );
}
