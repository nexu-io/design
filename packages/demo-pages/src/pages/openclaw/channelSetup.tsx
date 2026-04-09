/* ── Channel icons for onboarding ── */
export function FeishuIconSetup({ size = 20, light }: { size?: number; light?: boolean }) {
  return (
    <img
      src="/feishu-logo.png"
      width={size}
      height={size}
      alt="Feishu"
      style={{ objectFit: "contain", ...(light ? { filter: "brightness(0) invert(1)" } : {}) }}
    />
  );
}
export function SlackIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
        fill="#E01E5A"
      />
      <path
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
        fill="#36C5F0"
      />
      <path
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
        fill="#2EB67D"
      />
      <path
        d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z"
        fill="#ECB22E"
      />
    </svg>
  );
}
export function DiscordIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
export function TelegramIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" fill="#26A5E4">
      <path d="m29.919 6.163l-4.225 19.925c-.319 1.406-1.15 1.756-2.331 1.094l-6.438-4.744l-3.106 2.988c-.344.344-.631.631-1.294.631l.463-6.556L24.919 8.72c.519-.462-.113-.719-.806-.256l-14.75 9.288l-6.35-1.988c-1.381-.431-1.406-1.381.288-2.044l24.837-9.569c1.15-.431 2.156.256 1.781 2.013z" />
    </svg>
  );
}
export function WhatsAppIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
export function WeChatIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#07C160">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
    </svg>
  );
}
export function DingTalkIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="140 50 730 920" fill="#0089FF">
      <path d="M573.7 252.5C422.5 197.4 201.3 96.7 201.3 96.7c-15.7-4.1-17.9 11.1-17.9 11.1c-5 61.1 33.6 160.5 53.6 182.8c19.9 22.3 319.1 113.7 319.1 113.7S326 357.9 270.5 341.9c-55.6-16-37.9 17.8-37.9 17.8c11.4 61.7 64.9 131.8 107.2 138.4c42.2 6.6 220.1 4 220.1 4s-35.5 4.1-93.2 11.9c-42.7 5.8-97 12.5-111.1 17.8c-33.1 12.5 24 62.6 24 62.6c84.7 76.8 129.7 50.5 129.7 50.5c33.3-10.7 61.4-18.5 85.2-24.2L565 743.1h84.6L603 928l205.3-271.9H700.8l22.3-38.7c.3.5.4.8.4.8S799.8 496.1 829 433.8l.6-1h-.1c5-10.8 8.6-19.7 10-25.8c17-71.3-114.5-99.4-265.8-154.5" />
    </svg>
  );
}
export function QQBotIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="150 70 720 860" fill="#12B7F5">
      <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112C331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3c-34 109.5-23 154.8-14.6 155.8c18 2.2 70.1-82.4 70.1-82.4c0 49 25.2 112.9 79.8 159c-26.4 8.1-85.7 29.9-71.6 53.8c11.4 19.3 196.2 12.3 249.5 6.3c53.3 6 238.1 13 249.5-6.3c14.1-23.8-45.3-45.7-71.6-53.8c54.6-46.2 79.8-110.1 79.8-159c0 0 52.1 84.6 70.1 82.4c8.5-1.1 19.5-46.4-14.5-155.8" />
    </svg>
  );
}
export function WeComIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="-0.5 1.5 25 21" fill="#2B7CE9">
      <path d="m17.326 8.158l-.003-.007a6.6 6.6 0 0 0-1.178-1.674c-1.266-1.307-3.067-2.19-5.102-2.417a9.3 9.3 0 0 0-2.124 0h-.001c-2.061.228-3.882 1.107-5.14 2.405a6.7 6.7 0 0 0-1.194 1.682A5.7 5.7 0 0 0 2 10.657c0 1.106.332 2.218.988 3.201l.006.01c.391.594 1.092 1.39 1.637 1.83l.983.793l-.208.875l.527-.267l.708-.358l.761.225c.467.137.955.227 1.517.29h.005q.515.06 1.026.059c.355 0 .724-.02 1.095-.06a9 9 0 0 0 1.346-.258c.095.7.43 1.337.932 1.81c-.658.208-1.352.358-2.061.436c-.442.048-.883.072-1.312.072q-.627 0-1.253-.072a10.7 10.7 0 0 1-1.861-.36l-2.84 1.438s-.29.131-.44.131c-.418 0-.702-.285-.702-.704c0-.252.067-.598.128-.84l.394-1.653c-.728-.586-1.563-1.544-2.052-2.287A7.76 7.76 0 0 1 0 10.658a7.7 7.7 0 0 1 .787-3.39a8.7 8.7 0 0 1 1.551-2.19c1.61-1.665 3.878-2.73 6.359-3.006a11.3 11.3 0 0 1 2.565 0c2.47.275 4.712 1.353 6.323 3.017a8.6 8.6 0 0 1 1.539 2.192c.466.945.769 1.937.769 2.978a3.06 3.06 0 0 0-2-.005c-.001-.644-.189-1.329-.564-2.09zm4.125 6.977l-.024-.024l-.024-.018l-.024-.018l-.096-.095a4.24 4.24 0 0 1-1.169-2.192q0-.038-.006-.075l-.006-.056l-.035-.144a1.3 1.3 0 0 0-.358-.61a1.386 1.386 0 0 0-1.957 0a1.4 1.4 0 0 0 0 1.963c.191.191.418.311.668.371c.024.012.06.012.084.012q.019 0 .041.006q.023.005.042.006a4.24 4.24 0 0 1 2.231 1.186c.048.048.096.095.131.143a.323.323 0 0 0 .466 0a.35.35 0 0 0 .036-.455m-1.05 4.37l-.025.025c-.119.096-.31.096-.453-.036a.326.326 0 0 1 0-.467c.047-.036.094-.083.141-.13l.002-.002a4.27 4.27 0 0 0 1.187-2.28q.005-.024.006-.043c0-.024 0-.06.012-.084a1.386 1.386 0 0 1 2.326-.67a1.4 1.4 0 0 1 0 1.964c-.167.18-.382.299-.608.359l-.143.036l-.057.005q-.035.006-.075.007a4.2 4.2 0 0 0-2.183 1.173l-.095.096q-.009.01-.018.024t-.018.024m-4.392-1.053l.024.024l.024.018q.015.009.024.018l.096.096a4.25 4.25 0 0 1 1.169 2.19q0 .04.006.076q.005.03.006.057l.035.143c.06.228.18.443.358.611c.537.539 1.42.539 1.957 0a1.4 1.4 0 0 0 0-1.964a1.4 1.4 0 0 0-.668-.371c-.024-.012-.06-.012-.084-.012q-.018 0-.041-.006l-.042-.006a4.25 4.25 0 0 1-2.231-1.185a1.4 1.4 0 0 1-.131-.144a.323.323 0 0 0-.466 0a.325.325 0 0 0-.036.455m1.039-4.358l.024-.024a.32.32 0 0 1 .453.035a.326.326 0 0 1 0 .467c-.047.036-.094.083-.141.13l-.002.002a4.27 4.27 0 0 0-1.187 2.281l-.006.042c0 .024 0 .06-.012.084a1.386 1.386 0 0 1-2.326.67a1.4 1.4 0 0 1 0-1.963c.166-.18.381-.3.608-.36l.143-.035q.026 0 .056-.006q.037-.005.075-.006a4.2 4.2 0 0 0 2.183-1.174l.096-.095l.018-.025z" />
    </svg>
  );
}

export const ONBOARDING_CHANNELS = [
  {
    id: "feishu",
    name: "Feishu",
    shortName: "Feishu",
    icon: FeishuIconSetup,
    color: "#FFFFFF",
    recommended: true,
    docUrl: "https://docs.nexu.ai/channels/feishu",
    chatUrl: "https://www.feishu.cn/",
  },
  {
    id: "slack",
    name: "Slack",
    shortName: "Slack",
    icon: SlackIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/slack",
    chatUrl: "https://slack.com/",
  },
  {
    id: "discord",
    name: "Discord",
    shortName: "Discord",
    icon: DiscordIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/discord",
    chatUrl: "https://discord.com/",
  },
  {
    id: "telegram",
    name: "Telegram",
    shortName: "Telegram",
    icon: TelegramIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/telegram",
    chatUrl: "https://telegram.org/",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    shortName: "WhatsApp",
    icon: WhatsAppIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/whatsapp",
    chatUrl: "https://web.whatsapp.com/",
  },
  {
    id: "wechat",
    name: "WeChat",
    shortName: "WeChat",
    icon: WeChatIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/wechat",
    chatUrl: "https://web.wechat.com/",
  },
  {
    id: "dingtalk",
    name: "DingTalk",
    shortName: "DingTalk",
    icon: DingTalkIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/dingtalk",
    chatUrl: "https://www.dingtalk.com/",
  },
  {
    id: "qqbot",
    name: "QQ Bot",
    shortName: "QQ Bot",
    icon: QQBotIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/qqbot",
    chatUrl: "https://bot.q.qq.com/",
  },
  {
    id: "wecom",
    name: "WeCom",
    shortName: "WeCom",
    icon: WeComIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/wecom",
    chatUrl: "https://work.weixin.qq.com/",
  },
];

export const CHANNELS_CONNECTED_KEY = 'nexu_channels_connected';
export const CHANNEL_ACTIVE_KEY = 'nexu_channel_active';
export const SEEDANCE_BANNER_DISMISSED_KEY = 'nexu_seedance_banner_dismissed';

export const CHANNEL_CONFIG_FIELDS: Record<
  string,
  { id: string; label: string; placeholder: string; helpText: string }[]
> = {
  feishu: [
    {
      id: "appId",
      label: "App ID",
      placeholder: "cli_xxxxxxxxxxxxxxxx",
      helpText: "Found in Feishu Open Platform > App Credentials",
    },
    {
      id: "appSecret",
      label: "App Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in Feishu Open Platform > App Credentials",
    },
  ],
  slack: [
    {
      id: "botToken",
      label: "Bot User OAuth Token",
      placeholder: "xoxb-...",
      helpText: "Found in Slack App > OAuth & Permissions",
    },
    {
      id: "signingSecret",
      label: "Signing Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in Slack App > Basic Information",
    },
  ],
  discord: [
    {
      id: "appId",
      label: "App ID",
      placeholder: "000000000000000000",
      helpText: "Found in Discord Developer Portal > General Information",
    },
    {
      id: "botToken",
      label: "Bot Token",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in Discord Developer Portal > Bot",
    },
  ],
  telegram: [
    {
      id: "botToken",
      label: "Bot Token",
      placeholder: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
      helpText: "Obtain from @BotFather on Telegram",
    },
  ],
  whatsapp: [
    {
      id: "phoneNumberId",
      label: "Phone Number ID",
      placeholder: "000000000000000",
      helpText: "Found in Meta Business Suite > WhatsApp > API Setup",
    },
    {
      id: "accessToken",
      label: "Access Token",
      placeholder: "EAAxxxxxxxxxxxxxxxx",
      helpText: "Found in Meta Business Suite > WhatsApp > API Setup",
    },
  ],
  wechat: [
    {
      id: "appId",
      label: "App ID",
      placeholder: "wx0000000000000000",
      helpText: "Found in WeChat Official Accounts Platform > Basic Configuration",
    },
    {
      id: "appSecret",
      label: "App Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in WeChat Official Accounts Platform > Basic Configuration",
    },
  ],
  dingtalk: [
    {
      id: "appKey",
      label: "App Key",
      placeholder: "dingxxxxxxxxxxxxxxxxxx",
      helpText: "Found in DingTalk Open Platform > App Credentials",
    },
    {
      id: "appSecret",
      label: "App Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in DingTalk Open Platform > App Credentials",
    },
  ],
  qqbot: [
    {
      id: "appId",
      label: "App ID",
      placeholder: "000000000",
      helpText: "Found in QQ Bot Open Platform > App Management",
    },
    {
      id: "appSecret",
      label: "App Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in QQ Bot Open Platform > App Management",
    },
  ],
  wecom: [
    {
      id: "corpId",
      label: "Corp ID",
      placeholder: "ww0000000000000000",
      helpText: "Found in WeCom Admin Console > My Enterprise > Enterprise Info",
    },
    {
      id: "agentSecret",
      label: "Agent Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in WeCom Admin Console > App Management > App Secret",
    },
  ],
};
