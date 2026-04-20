import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Bot, Check, Hash, Search, Users } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  FormFieldControl,
  Input,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  cn,
} from '@nexu-design/ui-web';

import { useT } from '@/i18n';
import { mockAgents, mockUsers } from '@/mock/data';
import { useAgentsStore } from '@/stores/agents';
import { useChatStore } from '@/stores/chat';
import type { Channel, MemberRef } from '@/types';

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (channelId: string) => void;
}

type Step = 'details' | 'members';

export function CreateChannelDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateChannelDialogProps): React.ReactElement {
  const t = useT();
  const addChannel = useChatStore((s) => s.addChannel);
  const storeAgents = useAgentsStore((s) => s.agents);
  const agents = storeAgents.length > 0 ? storeAgents : mockAgents;

  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(() =>
    mockUsers.map((user) => user.id),
  );
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    setStep('details');
    setName('');
    setDescription('');
    setQuery('');
    setSelectedUserIds(mockUsers.map((user) => user.id));
    setSelectedAgentIds(agents.map((agent) => agent.id));

    requestAnimationFrame(() => nameInputRef.current?.focus());
  }, [open, agents]);

  useEffect(() => {
    if (step !== 'members') return;
    requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [step]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return mockUsers;

    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().indexOf(normalizedQuery) !== -1 ||
        user.email.toLowerCase().indexOf(normalizedQuery) !== -1,
    );
  }, [query]);

  const filteredAgents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return agents;

    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().indexOf(normalizedQuery) !== -1 ||
        (agent.description ?? '').toLowerCase().indexOf(normalizedQuery) !== -1,
    );
  }, [agents, query]);

  const toggleUser = (id: string): void => {
    setSelectedUserIds((prev) => {
      if (prev.indexOf(id) !== -1) {
        return prev.filter((userId) => userId !== id);
      } else {
        return prev.concat(id);
      }
    });
  };

  const toggleAgent = (id: string): void => {
    setSelectedAgentIds((prev) => {
      if (prev.indexOf(id) !== -1) {
        return prev.filter((agentId) => agentId !== id);
      } else {
        return prev.concat(id);
      }
    });
  };

  const totalSelected = selectedUserIds.length + selectedAgentIds.length;

  const handleNext = (): void => {
    if (!name.trim()) return;
    setStep('members');
  };

  const handleCreate = (): void => {
    const trimmedName = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (!trimmedName) return;

    const members: MemberRef[] = [
      ...selectedUserIds.map((id): MemberRef => ({ kind: 'user', id })),
      ...selectedAgentIds.map((id): MemberRef => ({ kind: 'agent', id })),
    ];

    const channel: Channel = {
      id: `ch-${Date.now()}`,
      name: trimmedName,
      description: description.trim() || undefined,
      type: 'channel',
      members,
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    };

    addChannel(channel);
    onOpenChange(false);
    setTimeout(() => onCreated?.(channel.id), 0);
  };

  const handleDetailsKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey && name.trim()) {
      event.preventDefault();
      handleNext();
    }
  };

  const subtitle =
    step === 'details'
      ? `${t('createChannel.stepOfTwo', { step: '1' })}${t('createChannel.detailsSuffix')}`
      : `${t('createChannel.stepOfTwo', { step: '2' })}${
          totalSelected === 1
            ? t('createChannel.membersSuffix', { count: String(totalSelected) })
            : t('createChannel.membersSuffixPlural', { count: String(totalSelected) })
        }`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              {step === 'members' ? (
                <Button variant="ghost" size="icon-sm" onClick={() => setStep('details')}>
                  <ArrowLeft className="size-4" />
                </Button>
              ) : null}
              <div className="space-y-1">
                <DialogTitle>
                  {step === 'details' ? t('createChannel.title') : t('createChannel.addMembers')}
                </DialogTitle>
                <DialogDescription>{subtitle}</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <div className="h-1.5 w-12 rounded-full bg-accent" />
              <div
                className={cn(
                  'h-1.5 w-12 rounded-full transition-colors',
                  step === 'members' ? 'bg-accent' : 'bg-surface-3',
                )}
              />
            </div>
          </div>
        </DialogHeader>

        <DialogBody>
          {step === 'details' ? (
            <div className="space-y-4">
              <FormField label={t('createChannel.nameLabel')}>
                <FormFieldControl>
                  <Input
                    ref={nameInputRef}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onKeyDown={handleDetailsKeyDown}
                    placeholder={t('createChannel.namePlaceholder')}
                    leadingIcon={<Hash className="size-4" />}
                  />
                </FormFieldControl>
              </FormField>

              <FormField
                label={
                  <span>
                    {t('createChannel.descLabel')}{' '}
                    <span className="font-normal text-text-muted">{t('createChannel.optional')}</span>
                  </span>
                }
              >
                <FormFieldControl>
                  <Input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    onKeyDown={handleDetailsKeyDown}
                    placeholder={t('createChannel.descPlaceholder')}
                  />
                </FormFieldControl>
              </FormField>
            </div>
          ) : (
            <div className="space-y-4">
              <FormField label="Find members">
                <FormFieldControl>
                  <Input
                    ref={searchInputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('createChannel.searchPlaceholder')}
                    leadingIcon={<Search className="size-4" />}
                  />
                </FormFieldControl>
              </FormField>

              <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
                {filteredUsers.length === 0 && filteredAgents.length === 0 ? (
                  <EmptyState
                    title={t('common.noMatches')}
                    description="Try a different search to find people or agents to add."
                    icon={<Users className="size-6" />}
                    className="border-border-subtle"
                  />
                ) : (
                  <>
                    <SelectionSection label="People" count={filteredUsers.length}>
                      {filteredUsers.map((user) => {
                        const selected = selectedUserIds.indexOf(user.id) !== -1;
                        return (
                          <InteractiveRow
                            key={`user-${user.id}`}
                            selected={selected}
                            tone="subtle"
                            onClick={() => toggleUser(user.id)}
                            className="px-3 py-2"
                          >
                            <InteractiveRowLeading>
                              <Avatar className="size-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            </InteractiveRowLeading>
                            <InteractiveRowContent>
                              <div className="text-[13px] font-medium text-text-heading">{user.name}</div>
                              <div className="text-[11px] text-text-muted">{user.email}</div>
                            </InteractiveRowContent>
                            <InteractiveRowTrailing>
                              {selected ? (
                                <Check className="size-4 text-text-heading" strokeWidth={3} />
                              ) : null}
                            </InteractiveRowTrailing>
                          </InteractiveRow>
                        );
                      })}
                    </SelectionSection>

                    <SelectionSection label="Agents" count={filteredAgents.length}>
                      {filteredAgents.map((agent) => {
                        const selected = selectedAgentIds.indexOf(agent.id) !== -1;
                        return (
                          <InteractiveRow
                            key={`agent-${agent.id}`}
                            selected={selected}
                            tone="subtle"
                            onClick={() => toggleAgent(agent.id)}
                            className="px-3 py-2"
                          >
                            <InteractiveRowLeading>
                              {agent.avatar ? (
                                <img src={agent.avatar} alt={agent.name} className="size-8 rounded-lg" />
                              ) : (
                                <div className="flex size-8 items-center justify-center rounded-lg bg-surface-2">
                                  <Bot className="size-4 text-text-muted" />
                                </div>
                              )}
                            </InteractiveRowLeading>
                            <InteractiveRowContent>
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-medium text-text-heading">
                                  {agent.name}
                                </span>
                                <Badge variant="accent" size="xs">
                                  {t('createChannel.agentBadge')}
                                </Badge>
                              </div>
                              {agent.description ? (
                                <div className="text-[11px] text-text-muted">{agent.description}</div>
                              ) : null}
                            </InteractiveRowContent>
                            <InteractiveRowTrailing>
                              {selected ? (
                                <Check className="size-4 text-text-heading" strokeWidth={3} />
                              ) : null}
                            </InteractiveRowTrailing>
                          </InteractiveRow>
                        );
                      })}
                    </SelectionSection>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          {step === 'details' ? (
            <Button onClick={handleNext} disabled={!name.trim()}>
              {t('common.next')}
            </Button>
          ) : (
            <Button onClick={handleCreate}>{t('createChannel.createCta')}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SelectionSection({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">{label}</h3>
        <span className="text-[11px] text-text-muted">{count}</span>
      </div>
      <div className="space-y-1">{children}</div>
    </section>
  );
}
