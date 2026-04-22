import { useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  Smile as SmileIcon,
  Sticker as StickerIcon,
  Trash2,
} from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useStickersStore } from "@/stores/stickers";

interface EmojiCategory {
  key: string;
  label: string;
  icon: string;
  emojis: { char: string; name: string }[];
}

const CATEGORIES: EmojiCategory[] = [
  {
    key: "smileys",
    label: "Smileys",
    icon: "😀",
    emojis: [
      { char: "😀", name: "grinning" },
      { char: "😃", name: "smiley" },
      { char: "😄", name: "smile" },
      { char: "😁", name: "grin" },
      { char: "😆", name: "laughing" },
      { char: "😅", name: "sweat smile" },
      { char: "🤣", name: "rofl" },
      { char: "😂", name: "joy" },
      { char: "🙂", name: "slight smile" },
      { char: "🙃", name: "upside down" },
      { char: "😉", name: "wink" },
      { char: "😊", name: "blush" },
      { char: "😇", name: "innocent" },
      { char: "🥰", name: "smiling with hearts" },
      { char: "😍", name: "heart eyes" },
      { char: "🤩", name: "star struck" },
      { char: "😘", name: "kiss" },
      { char: "😋", name: "yum" },
      { char: "😛", name: "tongue" },
      { char: "🤔", name: "thinking" },
      { char: "🤨", name: "raised eyebrow" },
      { char: "😐", name: "neutral" },
      { char: "😑", name: "expressionless" },
      { char: "😶", name: "no mouth" },
      { char: "🙄", name: "eye roll" },
      { char: "😏", name: "smirk" },
      { char: "😣", name: "persevere" },
      { char: "😥", name: "sad relieved" },
      { char: "😮", name: "open mouth" },
      { char: "🤐", name: "zipper" },
      { char: "😯", name: "hushed" },
      { char: "😪", name: "sleepy" },
      { char: "😫", name: "tired" },
      { char: "🥱", name: "yawn" },
      { char: "😴", name: "sleeping" },
      { char: "😌", name: "relieved" },
      { char: "😛", name: "tongue out" },
      { char: "😜", name: "winking tongue" },
      { char: "😝", name: "squinting tongue" },
      { char: "🤤", name: "drooling" },
      { char: "😒", name: "unamused" },
      { char: "😓", name: "sweat" },
      { char: "😔", name: "pensive" },
      { char: "🥺", name: "pleading" },
      { char: "😢", name: "cry" },
      { char: "😭", name: "sob" },
      { char: "😤", name: "triumph" },
      { char: "😠", name: "angry" },
      { char: "😡", name: "rage" },
      { char: "🤯", name: "mind blown" },
      { char: "🥳", name: "party" },
      { char: "😎", name: "cool" },
      { char: "🤓", name: "nerd" },
    ],
  },
  {
    key: "gestures",
    label: "Gestures",
    icon: "👍",
    emojis: [
      { char: "👍", name: "thumbs up" },
      { char: "👎", name: "thumbs down" },
      { char: "👌", name: "ok hand" },
      { char: "🤌", name: "pinched" },
      { char: "🤏", name: "pinching" },
      { char: "✌️", name: "victory" },
      { char: "🤞", name: "crossed fingers" },
      { char: "🤟", name: "love you" },
      { char: "🤘", name: "rock on" },
      { char: "🤙", name: "call me" },
      { char: "👈", name: "point left" },
      { char: "👉", name: "point right" },
      { char: "👆", name: "point up" },
      { char: "👇", name: "point down" },
      { char: "☝️", name: "index up" },
      { char: "👋", name: "wave" },
      { char: "🤚", name: "raised back" },
      { char: "🖐️", name: "hand splayed" },
      { char: "✋", name: "raised hand" },
      { char: "🖖", name: "vulcan" },
      { char: "👏", name: "clap" },
      { char: "🙌", name: "raised hands" },
      { char: "🤝", name: "handshake" },
      { char: "🙏", name: "pray" },
      { char: "💪", name: "muscle" },
      { char: "🫡", name: "salute" },
      { char: "🫰", name: "finger heart" },
      { char: "🫶", name: "heart hands" },
    ],
  },
  {
    key: "hearts",
    label: "Hearts",
    icon: "❤️",
    emojis: [
      { char: "❤️", name: "red heart" },
      { char: "🧡", name: "orange heart" },
      { char: "💛", name: "yellow heart" },
      { char: "💚", name: "green heart" },
      { char: "💙", name: "blue heart" },
      { char: "💜", name: "purple heart" },
      { char: "🖤", name: "black heart" },
      { char: "🤍", name: "white heart" },
      { char: "🤎", name: "brown heart" },
      { char: "❣️", name: "heart exclamation" },
      { char: "💕", name: "two hearts" },
      { char: "💞", name: "revolving hearts" },
      { char: "💓", name: "beating heart" },
      { char: "💗", name: "growing heart" },
      { char: "💖", name: "sparkling heart" },
      { char: "💘", name: "heart arrow" },
      { char: "💝", name: "heart ribbon" },
      { char: "💟", name: "heart decoration" },
      { char: "♥️", name: "hearts suit" },
      { char: "💔", name: "broken heart" },
    ],
  },
  {
    key: "animals",
    label: "Animals",
    icon: "🐶",
    emojis: [
      { char: "🐶", name: "dog" },
      { char: "🐱", name: "cat" },
      { char: "🐭", name: "mouse" },
      { char: "🐹", name: "hamster" },
      { char: "🐰", name: "rabbit" },
      { char: "🦊", name: "fox" },
      { char: "🐻", name: "bear" },
      { char: "🐼", name: "panda" },
      { char: "🐨", name: "koala" },
      { char: "🐯", name: "tiger" },
      { char: "🦁", name: "lion" },
      { char: "🐮", name: "cow" },
      { char: "🐷", name: "pig" },
      { char: "🐸", name: "frog" },
      { char: "🐵", name: "monkey" },
      { char: "🐔", name: "chicken" },
      { char: "🐧", name: "penguin" },
      { char: "🐦", name: "bird" },
      { char: "🦆", name: "duck" },
      { char: "🦅", name: "eagle" },
      { char: "🦉", name: "owl" },
      { char: "🦇", name: "bat" },
      { char: "🐺", name: "wolf" },
      { char: "🐗", name: "boar" },
      { char: "🐴", name: "horse" },
      { char: "🦄", name: "unicorn" },
      { char: "🐝", name: "bee" },
      { char: "🐛", name: "bug" },
      { char: "🦋", name: "butterfly" },
      { char: "🐢", name: "turtle" },
    ],
  },
  {
    key: "food",
    label: "Food",
    icon: "🍕",
    emojis: [
      { char: "🍎", name: "apple" },
      { char: "🍊", name: "orange" },
      { char: "🍋", name: "lemon" },
      { char: "🍌", name: "banana" },
      { char: "🍉", name: "watermelon" },
      { char: "🍇", name: "grape" },
      { char: "🍓", name: "strawberry" },
      { char: "🫐", name: "blueberry" },
      { char: "🥝", name: "kiwi" },
      { char: "🍍", name: "pineapple" },
      { char: "🥑", name: "avocado" },
      { char: "🍆", name: "eggplant" },
      { char: "🥔", name: "potato" },
      { char: "🥕", name: "carrot" },
      { char: "🌽", name: "corn" },
      { char: "🌶️", name: "pepper" },
      { char: "🍞", name: "bread" },
      { char: "🥐", name: "croissant" },
      { char: "🥖", name: "baguette" },
      { char: "🧀", name: "cheese" },
      { char: "🥚", name: "egg" },
      { char: "🍳", name: "cooking" },
      { char: "🥞", name: "pancakes" },
      { char: "🥓", name: "bacon" },
      { char: "🍔", name: "burger" },
      { char: "🍟", name: "fries" },
      { char: "🍕", name: "pizza" },
      { char: "🌭", name: "hot dog" },
      { char: "🌮", name: "taco" },
      { char: "🌯", name: "burrito" },
      { char: "🍣", name: "sushi" },
      { char: "🍜", name: "ramen" },
      { char: "🍰", name: "cake" },
      { char: "🍪", name: "cookie" },
      { char: "🍩", name: "donut" },
      { char: "🍫", name: "chocolate" },
      { char: "☕", name: "coffee" },
      { char: "🍵", name: "tea" },
      { char: "🍺", name: "beer" },
      { char: "🍷", name: "wine" },
    ],
  },
  {
    key: "activity",
    label: "Activity",
    icon: "⚽",
    emojis: [
      { char: "⚽", name: "soccer" },
      { char: "🏀", name: "basketball" },
      { char: "🏈", name: "football" },
      { char: "⚾", name: "baseball" },
      { char: "🎾", name: "tennis" },
      { char: "🏐", name: "volleyball" },
      { char: "🏓", name: "ping pong" },
      { char: "🏸", name: "badminton" },
      { char: "🥊", name: "boxing" },
      { char: "🎯", name: "target" },
      { char: "🎲", name: "dice" },
      { char: "🎮", name: "video game" },
      { char: "🎨", name: "art" },
      { char: "🎭", name: "theater" },
      { char: "🎬", name: "clapper" },
      { char: "🎤", name: "microphone" },
      { char: "🎧", name: "headphones" },
      { char: "🎸", name: "guitar" },
      { char: "🎹", name: "piano" },
      { char: "🥁", name: "drum" },
      { char: "🏆", name: "trophy" },
      { char: "🥇", name: "gold medal" },
      { char: "🎉", name: "party" },
      { char: "🎊", name: "confetti" },
      { char: "🎂", name: "birthday" },
      { char: "🎁", name: "gift" },
    ],
  },
  {
    key: "objects",
    label: "Objects",
    icon: "💡",
    emojis: [
      { char: "💡", name: "bulb" },
      { char: "🔦", name: "flashlight" },
      { char: "🕯️", name: "candle" },
      { char: "📱", name: "phone" },
      { char: "💻", name: "laptop" },
      { char: "⌨️", name: "keyboard" },
      { char: "🖥️", name: "desktop" },
      { char: "🖨️", name: "printer" },
      { char: "🖱️", name: "mouse" },
      { char: "💾", name: "floppy" },
      { char: "💿", name: "cd" },
      { char: "📷", name: "camera" },
      { char: "📹", name: "video" },
      { char: "🎥", name: "movie" },
      { char: "📺", name: "tv" },
      { char: "📻", name: "radio" },
      { char: "⏰", name: "alarm" },
      { char: "⌛", name: "hourglass" },
      { char: "📅", name: "calendar" },
      { char: "📌", name: "pushpin" },
      { char: "📎", name: "paperclip" },
      { char: "🔗", name: "link" },
      { char: "✂️", name: "scissors" },
      { char: "🔒", name: "lock" },
      { char: "🔑", name: "key" },
      { char: "🔨", name: "hammer" },
      { char: "🛠️", name: "tools" },
      { char: "⚙️", name: "gear" },
      { char: "🧲", name: "magnet" },
      { char: "💰", name: "moneybag" },
      { char: "💎", name: "diamond" },
      { char: "📚", name: "books" },
      { char: "✏️", name: "pencil" },
      { char: "🖊️", name: "pen" },
    ],
  },
  {
    key: "symbols",
    label: "Symbols",
    icon: "✨",
    emojis: [
      { char: "✨", name: "sparkles" },
      { char: "⭐", name: "star" },
      { char: "🌟", name: "glowing star" },
      { char: "💫", name: "dizzy" },
      { char: "🔥", name: "fire" },
      { char: "💥", name: "boom" },
      { char: "💯", name: "hundred" },
      { char: "✅", name: "check" },
      { char: "❌", name: "cross" },
      { char: "❓", name: "question" },
      { char: "❗", name: "exclamation" },
      { char: "⚠️", name: "warning" },
      { char: "🚀", name: "rocket" },
      { char: "🎯", name: "bullseye" },
      { char: "💭", name: "thought" },
      { char: "💬", name: "speech" },
      { char: "🔔", name: "bell" },
      { char: "🔕", name: "mute" },
      { char: "☀️", name: "sun" },
      { char: "🌙", name: "moon" },
      { char: "⚡", name: "zap" },
      { char: "☁️", name: "cloud" },
      { char: "🌈", name: "rainbow" },
      { char: "❄️", name: "snow" },
    ],
  },
];

const RECENT_STORAGE_KEY = "nexu:emoji:recent";
const MAX_RECENT = 24;

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveRecent(list: string[]): void {
  try {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  /** When provided, shows a sticker tab in the picker. Called with the sticker's URL. */
  onStickerSelect?: (stickerUrl: string) => void;
}

type Mode = "emoji" | "stickers";

export function EmojiPicker({
  onSelect,
  onStickerSelect,
}: EmojiPickerProps): React.ReactElement {
  const [mode, setMode] = useState<Mode>("emoji");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].key);
  const [recent, setRecent] = useState<string[]>(() => loadRecent());
  const stickersEnabled = !!onStickerSelect;

  const handlePick = (char: string): void => {
    onSelect(char);
    setRecent((prev) => {
      const next = [char, ...prev.filter((c) => c !== char)].slice(0, MAX_RECENT);
      saveRecent(next);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const all = CATEGORIES.flatMap((c) => c.emojis);
    return all.filter((e) => e.name.includes(q));
  }, [query]);

  const currentCat = CATEGORIES.find((c) => c.key === activeCat) ?? CATEGORIES[0];

  return (
    <div className="flex w-[320px] flex-col">
      {mode === "emoji" ? (
        <>
          <div className="px-2.5 pt-2.5 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search emoji"
                className="h-8 w-full rounded-md border border-input bg-surface-0 pl-7 pr-2 text-[12.5px] text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
          </div>

          <div className="flex max-h-[280px] flex-col overflow-hidden">
            {!query ? (
              <div className="sticky top-0 z-10 flex items-center gap-0.5 border-b border-border bg-surface-0 px-2 pb-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setActiveCat(c.key)}
                    title={c.label}
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-md text-[17px] transition-colors",
                      activeCat === c.key
                        ? "bg-brand-primary/10"
                        : "hover:bg-surface-2",
                    )}
                  >
                    <span className="leading-none">{c.icon}</span>
                    {activeCat === c.key ? (
                      <span className="absolute -bottom-1.5 left-1.5 right-1.5 h-0.5 rounded-full bg-brand-primary" />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto px-2 py-2">
              {filtered ? (
                filtered.length > 0 ? (
                  <EmojiGrid emojis={filtered} onPick={handlePick} />
                ) : (
                  <div className="flex flex-col items-center gap-1 px-2 py-8 text-center text-text-muted">
                    <Search className="size-5 opacity-40" />
                    <div className="text-[12px]">没有匹配 “{query}” 的表情</div>
                  </div>
                )
              ) : (
                <>
                  {recent.length > 0 ? (
                    <div className="mb-2">
                      <div className="px-0.5 pb-1 text-[11px] font-medium text-text-muted">
                        常用
                      </div>
                      <EmojiGrid
                        emojis={recent.map((char) => ({ char, name: char }))}
                        onPick={handlePick}
                      />
                    </div>
                  ) : null}
                  <div className="px-0.5 pb-1 text-[11px] font-medium text-text-muted">
                    {currentCat.label}
                  </div>
                  <EmojiGrid emojis={currentCat.emojis} onPick={handlePick} />
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <StickerPanel onPick={onStickerSelect ?? (() => undefined)} />
      )}

      {stickersEnabled ? (
        <div className="flex items-center gap-0.5 border-t border-border bg-surface-1/60 p-1">
          <button
            type="button"
            onClick={() => setMode("emoji")}
            title="Emoji"
            className={cn(
              "inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md text-[12px] font-medium transition-colors",
              mode === "emoji"
                ? "bg-surface-0 text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary",
            )}
          >
            <SmileIcon className="size-3.5" />
            表情
          </button>
          <button
            type="button"
            onClick={() => setMode("stickers")}
            title="Stickers"
            className={cn(
              "inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md text-[12px] font-medium transition-colors",
              mode === "stickers"
                ? "bg-surface-0 text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary",
            )}
          >
            <StickerIcon className="size-3.5" />
            表情包
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface StickerPanelProps {
  onPick: (url: string) => void;
}

function StickerPanel({ onPick }: StickerPanelProps): React.ReactElement {
  const stickers = useStickersStore((s) => s.stickers);
  const addSticker = useStickersStore((s) => s.addSticker);
  const removeSticker = useStickersStore((s) => s.removeSticker);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [manageMode, setManageMode] = useState(false);

  const handleAddClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;
    const reads: Promise<void>[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      reads.push(
        new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
              addSticker(result, file.name);
            }
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(file);
        }),
      );
    }
    Promise.all(reads).finally(() => {
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-2.5 pt-2.5 pb-2">
        <span className="text-[11px] font-medium text-text-muted">我的表情包</span>
        <button
          type="button"
          onClick={() => setManageMode((v) => !v)}
          className={cn(
            "rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors",
            manageMode
              ? "bg-brand-primary/10 text-brand-primary"
              : "text-text-muted hover:bg-surface-2 hover:text-text-primary",
          )}
        >
          {manageMode ? "完成" : "管理"}
        </button>
      </div>
      <div className="max-h-[260px] overflow-y-auto px-2 pb-2">
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={handleAddClick}
            title="Add sticker"
            className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed border-border text-text-muted transition-all hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary"
          >
            <Plus className="size-4" />
            <span className="text-[10px]">上传</span>
          </button>
          {stickers.map((s) => (
            <div key={s.id} className="group relative">
              <button
                type="button"
                onClick={() => (manageMode ? undefined : onPick(s.url))}
                disabled={manageMode}
                title={s.name}
                className={cn(
                  "flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-surface-2/60 p-1.5 transition-all",
                  !manageMode &&
                    "hover:scale-105 hover:bg-surface-2 hover:shadow-sm active:scale-95",
                  manageMode && "cursor-default opacity-90",
                )}
              >
                <img
                  src={s.url}
                  alt={s.name}
                  className="max-h-full max-w-full object-contain"
                  draggable={false}
                />
              </button>
              {manageMode ? (
                <button
                  type="button"
                  onClick={() => removeSticker(s.id)}
                  aria-label="Remove sticker"
                  className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-danger text-white shadow-md transition-transform hover:scale-110"
                >
                  <Trash2 className="size-2.5" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
        {stickers.length === 0 ? (
          <div className="px-2 py-6 text-center text-[12px] text-text-muted">
            还没有表情包，点击 <span className="font-medium">上传</span> 添加图片
          </div>
        ) : null}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

interface EmojiGridProps {
  emojis: { char: string; name: string }[];
  onPick: (char: string) => void;
}

function EmojiGrid({ emojis, onPick }: EmojiGridProps): React.ReactElement {
  return (
    <div className="grid grid-cols-8 gap-0.5">
      {emojis.map((e, i) => (
        <button
          key={`${e.char}-${i}`}
          type="button"
          onClick={() => onPick(e.char)}
          title={e.name}
          aria-label={e.name}
          className="flex aspect-square items-center justify-center rounded-md text-[20px] leading-none transition-all hover:scale-110 hover:bg-surface-2 active:scale-95"
        >
          {e.char}
        </button>
      ))}
    </div>
  );
}
