export function getSelectedZipFile<T extends { name: string }>(
  file: T | null | undefined,
): T | null {
  if (!file) {
    return null;
  }

  return file.name.toLowerCase().endsWith(".zip") ? file : null;
}

export function createAutoCloseController() {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return {
    schedule(onClose: () => void, delayMs: number) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        timeoutId = null;
        onClose();
      }, delayMs);
    },
    cancel() {
      if (timeoutId === null) {
        return;
      }

      clearTimeout(timeoutId);
      timeoutId = null;
    },
  };
}
