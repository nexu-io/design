type OpenExternalFn = (url: string) => void | Promise<void>;

let openExternalImpl: OpenExternalFn = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export function configureOpenExternal(next: OpenExternalFn) {
  openExternalImpl = next;
}

export async function openExternal(url: string) {
  try {
    await openExternalImpl(url);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
