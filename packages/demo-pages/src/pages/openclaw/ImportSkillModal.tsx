import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nexu-design/ui-web";
import { AlertCircle, CheckCircle2, Info, Lock, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { createAutoCloseController, getSelectedZipFile } from "./import-skill-modal-state";

type ImportTab = "zip" | "github";

interface ImportSkillModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void> | void;
}

export function ImportSkillModal({ open, onClose, onImport }: ImportSkillModalProps) {
  const [tab, setTab] = useState<ImportTab>("zip");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoCloseControllerRef = useRef(createAutoCloseController());

  const reset = useCallback(() => {
    autoCloseControllerRef.current.cancel();
    setTab("zip");
    setDragOver(false);
    setSelectedFile(null);
    setDone(false);
    setError(null);
    setImporting(false);
  }, []);

  useEffect(() => {
    return () => {
      autoCloseControllerRef.current.cancel();
    };
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleFileSelection = (file: File | null | undefined) => {
    const zipFile = getSelectedZipFile(file);

    if (!zipFile && file) {
      setSelectedFile(null);
      setError("Only .zip skill packages are supported in this demo.");
      return;
    }

    setSelectedFile(zipFile);
    setError(null);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setImporting(true);
      setError(null);
      await onImport(selectedFile);
      setDone(true);
      autoCloseControllerRef.current.schedule(handleClose, 1200);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent size="md" className="max-w-[560px] p-0">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base">Import skill</DialogTitle>
          <DialogDescription>
            Import a local skill package into the OpenClaw workspace demo.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as ImportTab);
            setDone(false);
            setError(null);
          }}
          className="px-5 pt-4"
        >
          <TabsList className="inline-flex h-10 rounded-full">
            <TabsTrigger value="zip" className="px-4 text-[13px]">
              Upload ZIP
            </TabsTrigger>
            <TabsTrigger value="github" className="gap-1.5 px-4 text-[13px]">
              GitHub link
              <Badge variant="outline" size="xs" className="pointer-events-none">
                Soon
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="zip" className="mt-4">
            <DialogBody className="px-0 pb-0">
              {done ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10">
                  <CheckCircle2 size={32} className="text-success" />
                  <p className="text-sm font-medium text-text-primary">Skill imported</p>
                  <p className="text-xs text-text-muted">The skill is now available under Yours.</p>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDragOver(false);
                      handleFileSelection(event.dataTransfer.files[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center transition-colors ${
                      dragOver
                        ? "border-brand-primary bg-brand-subtle"
                        : selectedFile
                          ? "border-success bg-success-subtle"
                          : "border-border-strong hover:border-border-hover hover:bg-surface-1"
                    }`}
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-surface-1 text-text-secondary">
                      <Upload size={18} />
                    </div>
                    {selectedFile ? (
                      <>
                        <p className="text-sm font-medium text-text-primary">{selectedFile.name}</p>
                        <p className="text-xs text-text-muted">
                          Click or drop another file to replace it.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-text-primary">
                          Drop a .zip skill package here
                        </p>
                        <p className="text-xs text-text-muted">
                          or click to browse from your computer
                        </p>
                      </>
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip"
                    className="hidden"
                    onChange={(event) => {
                      handleFileSelection(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />

                  {error ? (
                    <div className="mt-3 flex items-start gap-2">
                      <AlertCircle size={12} className="mt-0.5 shrink-0 text-error" />
                      <p className="text-xs leading-relaxed text-error">{error}</p>
                    </div>
                  ) : null}

                  <div className="mt-3 flex items-start gap-2">
                    <Info size={12} className="mt-0.5 shrink-0 text-text-muted" />
                    <p className="text-xs leading-relaxed text-text-muted">
                      Expected package contents: <span className="font-mono">SKILL.md</span>,
                      optional assets, and supporting files.
                    </p>
                  </div>
                </div>
              )}
            </DialogBody>
          </TabsContent>

          <TabsContent value="github" className="mt-4">
            <DialogBody className="px-0 pb-0">
              <div>
                <div className="text-xs font-medium text-text-secondary">Repository URL</div>
                <Input
                  type="url"
                  placeholder="https://github.com/user/repo"
                  className="mt-1.5"
                  disabled
                  readOnly
                />
                <div className="mt-4 flex items-start gap-2">
                  <Lock size={12} className="mt-0.5 shrink-0 text-text-muted" />
                  <p className="text-xs leading-relaxed text-text-muted">
                    GitHub import is not wired in the demo yet.
                  </p>
                </div>
              </div>
            </DialogBody>
          </TabsContent>
        </Tabs>

        {!done ? (
          <DialogFooter className="border-t border-border px-5 py-3">
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleImport}
              loading={importing}
              disabled={tab === "github" || !selectedFile}
            >
              <Upload size={14} />
              Import
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
