import { useState, useRef, useCallback } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from '@nexu/ui-web';
import { Tabs, TabsList, TabsTrigger, TabsContent, Button, Input, Label } from '@nexu/ui-web';

type ImportTab = 'folder' | 'github';

interface ImportSkillModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportSkillModal({ open, onClose }: ImportSkillModalProps) {
  const [tab, setTab] = useState<ImportTab>('folder');
  const [githubUrl, setGithubUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setTab('folder');
    setGithubUrl('');
    setDragOver(false);
    setSelectedFolder(null);
    setImporting(false);
    setDone(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFolderSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const path = (files[0] as any).webkitRelativePath || files[0].name;
      const folder = path.split('/')[0] || files[0].name;
      setSelectedFolder(folder);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      const entry = items[0].webkitGetAsEntry?.();
      if (entry?.isDirectory) {
        setSelectedFolder(entry.name);
      } else if (e.dataTransfer.files.length > 0) {
        setSelectedFolder(e.dataTransfer.files[0].name);
      }
    }
  };

  const canImport =
    (tab === 'folder' && selectedFolder) ||
    (tab === 'github' && githubUrl.trim().length > 0);

  const handleImport = () => {
    if (!canImport) return;
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
      setTimeout(() => handleClose(), 1200);
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Skill</DialogTitle>
          <DialogDescription>Add a custom skill from a folder or GitHub repository</DialogDescription>
        </DialogHeader>

          <Tabs value={tab} onValueChange={(v) => { setTab(v as ImportTab); setDone(false); }} className="px-6">
          <TabsList variant="underline">
            <TabsTrigger
              value="folder"
              variant="underline"
            >
              Upload Folder
            </TabsTrigger>
            <TabsTrigger
              value="github"
              variant="underline"
            >
              GitHub Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="folder">
            <DialogBody className="px-0">
              {done ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <CheckCircle2 size={32} className="text-[var(--color-success)]" />
                  <p className="text-[14px] font-medium text-text-primary">Skill imported successfully</p>
                </div>
              ) : (
                <div>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={handleFolderSelect}
                    className={`flex flex-col items-center justify-center gap-1.5 py-10 rounded-[12px] border border-dashed cursor-pointer transition-colors ${
                      dragOver
                        ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-subtle)]'
                        : selectedFolder
                          ? 'border-[var(--color-success)] bg-[var(--color-success)]/5'
                          : 'border-border-card hover:border-text-muted hover:bg-surface-1'
                    }`}
                  >
                    {selectedFolder ? (
                      <>
                        <p className="text-[13px] font-medium text-text-primary">{selectedFolder}</p>
                        <p className="text-[11px] text-text-muted">Click to change folder</p>
                      </>
                    ) : (
                      <>
                        <p className="text-[13px] font-medium text-text-primary">
                          Drag & drop a skill folder here
                        </p>
                        <p className="text-[11px] text-text-muted">
                          or click to browse
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    /* @ts-expect-error webkitdirectory is non-standard */
                    webkitdirectory=""
                    directory=""
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex items-start gap-1.5 mt-3">
                    <AlertCircle size={12} className="text-text-muted shrink-0 mt-0.5" />
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      The folder should contain a <code className="px-1 py-0.5 rounded bg-surface-2 text-[10px] font-mono">skill.json</code> manifest and any related prompt or config files.
                    </p>
                  </div>
                </div>
              )}
            </DialogBody>
          </TabsContent>

          <TabsContent value="github">
            <DialogBody className="px-0">
              {done ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <CheckCircle2 size={32} className="text-[var(--color-success)]" />
                  <p className="text-[14px] font-medium text-text-primary">Skill imported successfully</p>
                </div>
              ) : (
                <div>
                  <Label htmlFor="github-url">GitHub repository URL</Label>
                  <Input
                    id="github-url"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/user/repo or https://github.com/user/repo/tree/main/skills/my-skill"
                  />
                  <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
                    Paste a link to the full repository or a specific skill folder within the repo. nexu will clone and import automatically.
                  </p>
                  <div className="mt-4 flex items-start gap-1.5">
                    <AlertCircle size={12} className="text-text-muted shrink-0 mt-0.5" />
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      The repository must be public or accessible via your connected GitHub account.
                    </p>
                  </div>
                </div>
              )}
            </DialogBody>
          </TabsContent>
        </Tabs>

        {!done && (
          <DialogFooter>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!canImport || importing}
            >
              {importing ? 'Importing...' : 'Import'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
