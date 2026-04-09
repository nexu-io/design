import { useLocale } from '../../hooks/useLocale';
import { MOCK_CHANNELS } from './data';
import ChannelDetailPage from './ChannelDetailPage';

export function ConversationsView({ initialChannelId }: { initialChannelId?: string }) {
  const { t } = useLocale();
  const channels = MOCK_CHANNELS;
  const channelId = initialChannelId ?? channels[0]?.id ?? '';

  if (!channelId) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[13px] text-text-muted">
        {t('ws.conversations.selectFromSidebar')}
      </div>
    )
  }

  return <ChannelDetailPage channelId={channelId} />
}
