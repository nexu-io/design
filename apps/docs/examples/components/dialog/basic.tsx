"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@nexu-design/ui-web";

export function DialogBasicExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Connect channel</DialogTitle>
          <DialogDescription>Add credentials to finish setup.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <Input aria-label="Client ID" placeholder="Client ID" />
          <Input aria-label="Client secret" placeholder="Client secret" />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
