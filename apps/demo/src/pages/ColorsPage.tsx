import { PageShell, PageHeader, Section } from '../components/Section'

function Swatch({ name, value, token }: { name: string; value: string; token: string }) {
  return (
    <div className='flex flex-col'>
      <div className='h-16 rounded-lg border border-border' style={{ backgroundColor: value }} />
      <div className='mt-2 text-xs font-medium text-text-primary'>{name}</div>
      <div className='text-[11px] text-text-muted font-mono'>{value}</div>
      <div className='text-[11px] text-text-tertiary font-mono'>{token}</div>
    </div>
  )
}

export default function ColorsPage() {
  return (
    <PageShell>
      <PageHeader
        title='Color System'
        description='Cursor 风格暖白主题。黑色作为主交互色，极简单色调，让内容成为焦点。'
      />

      <Section title='Surface — 背景层级'>
        <div className='grid grid-cols-6 gap-3'>
          <Swatch name='Surface 0' value='#fdfcfa' token='--surface-0' />
          <Swatch name='Surface 1' value='#ffffff' token='--surface-1' />
          <Swatch name='Surface 2' value='#f8f7f4' token='--surface-2' />
          <Swatch name='Surface 3' value='#f0efec' token='--surface-3' />
          <Swatch name='Surface 4' value='#e8e7e3' token='--surface-4' />
          <Swatch name='Surface 5' value='#dfdeda' token='--surface-5' />
        </div>
      </Section>

      <Section title='Text — 文字层级'>
        <div className='grid grid-cols-4 gap-4'>
          {[
            { name: 'Primary', value: '#1a1a1a', sample: '主标题 / 正文' },
            { name: 'Secondary', value: '#6b6b68', sample: '描述 / 注释' },
            { name: 'Tertiary', value: '#9a9a96', sample: '时间戳 / 标签' },
            { name: 'Muted', value: '#bcbcb8', sample: '禁用态 / 占位符' },
          ].map(t => (
            <div key={t.name} className='bg-surface-2 rounded-lg p-4 border border-border'>
              <div className='text-lg font-semibold mb-1' style={{ color: t.value }}>Aa</div>
              <div className='text-xs font-medium' style={{ color: t.value }}>{t.name}</div>
              <div className='text-[11px] text-text-muted mt-1'>{t.sample}</div>
              <div className='text-[11px] font-mono text-text-muted'>{t.value}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title='Accent — 主交互色 (Dark)'>
        <div className='grid grid-cols-10 gap-2'>
          {[
            { n: '50', v: '#fafaf8' }, { n: '100', v: '#f0f0ee' }, { n: '200', v: '#e0e0de' },
            { n: '300', v: '#c0c0be' }, { n: '400', v: '#9a9a96' }, { n: '500', v: '#1a1a1a' },
            { n: '600', v: '#2d2d2d' }, { n: '700', v: '#404040' }, { n: '800', v: '#6b6b68' },
            { n: '900', v: '#9a9a96' },
          ].map(s => (
            <div key={s.n}>
              <div className='h-14 rounded-md border border-black/5' style={{ backgroundColor: s.v }} />
              <div className='text-[11px] text-text-tertiary mt-1.5 text-center'>{s.n}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title='Clone Signature — 分身标识色 (Warm Amber)'>
        <p className='text-xs text-text-tertiary mb-4'>分身的"生命信号" — 呼吸光环、在线指示、情感时刻使用此色。它是分身"活着"的视觉证据。</p>
        <div className='grid grid-cols-4 gap-4'>
          <div className='rounded-lg overflow-hidden border border-border'>
            <div className='h-16' style={{ backgroundColor: '#c08a25' }} />
            <div className='p-3 bg-surface-2'>
              <div className='text-xs font-medium text-text-primary'>Clone</div>
              <div className='text-[11px] text-text-muted font-mono'>#c08a25</div>
              <div className='text-[11px] text-text-muted'>主标识 / 呼吸光环</div>
            </div>
          </div>
          <div className='rounded-lg overflow-hidden border border-border'>
            <div className='h-16' style={{ backgroundColor: '#d4a05a' }} />
            <div className='p-3 bg-surface-2'>
              <div className='text-xs font-medium text-text-primary'>Clone Light</div>
              <div className='text-[11px] text-text-muted font-mono'>#d4a05a</div>
              <div className='text-[11px] text-text-muted'>高亮 / 成就</div>
            </div>
          </div>
          <div className='rounded-lg overflow-hidden border border-border'>
            <div className='h-16 border-b border-border' style={{ backgroundColor: 'rgba(192,138,37,0.10)' }} />
            <div className='p-3 bg-surface-2'>
              <div className='text-xs font-medium text-text-primary'>Clone Subtle</div>
              <div className='text-[11px] text-text-muted font-mono'>rgba(...0.10)</div>
              <div className='text-[11px] text-text-muted'>背景 / 选中态</div>
            </div>
          </div>
          <div className='rounded-lg overflow-hidden border border-border'>
            <div className='h-16 border-b border-border' style={{ backgroundColor: 'rgba(192,138,37,0.20)' }} />
            <div className='p-3 bg-surface-2'>
              <div className='text-xs font-medium text-text-primary'>Clone Glow</div>
              <div className='text-[11px] text-text-muted font-mono'>rgba(...0.20)</div>
              <div className='text-[11px] text-text-muted'>光晕 / 呼吸</div>
            </div>
          </div>
        </div>
        <div className='mt-6 flex items-center gap-8'>
          <div className='text-center'>
            <div className='w-16 h-16 rounded-full bg-surface-3 animate-clone-breath flex items-center justify-center text-2xl mx-auto'>😊</div>
            <div className='text-[11px] text-text-tertiary mt-2'>呼吸光环效果</div>
          </div>
          <div className='text-center'>
            <div className='relative'>
              <div className='w-16 h-16 rounded-full bg-surface-3 flex items-center justify-center text-2xl mx-auto'>😊</div>
              <div className='absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-clone border-2 border-white animate-clone-breath-subtle' />
            </div>
            <div className='text-[11px] text-text-tertiary mt-2'>在线指示灯</div>
          </div>
          <div className='flex-1 text-xs text-text-tertiary leading-relaxed'>
            Clone 色只用于分身"活着"的信号 — 呼吸动效、在线指示、新技能学会、里程碑庆祝。<br />
            按钮、边框等通用 UI 元素使用 Accent（暖白）。<br />
            这让 Clone 色成为产品中最具辨识度的视觉符号。
          </div>
        </div>
      </Section>

      <Section title='Status — 功能色'>
        <div className='grid grid-cols-4 gap-4'>
          {[
            { name: 'Success', color: '#16a34a', subtle: 'rgba(22,163,74,0.08)', use: '成功 / 完成 / 在线' },
            { name: 'Warning', color: '#ca8a04', subtle: 'rgba(202,138,4,0.08)', use: '警告 / 能量不足' },
            { name: 'Danger', color: '#dc2626', subtle: 'rgba(220,38,38,0.08)', use: '错误 / 紧急 / 停工' },
            { name: 'Info', color: '#2563eb', subtle: 'rgba(37,99,235,0.08)', use: '信息 / 提示' },
          ].map(s => (
            <div key={s.name}>
              <div className='flex gap-2 mb-2'>
                <div className='h-10 flex-1 rounded-md' style={{ backgroundColor: s.color }} />
                <div className='h-10 flex-1 rounded-md border border-border' style={{ backgroundColor: s.subtle }} />
              </div>
              <div className='text-xs font-medium text-text-primary'>{s.name}</div>
              <div className='text-[11px] text-text-muted'>{s.use}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title='Energy — 能量色'>
        <div className='flex gap-2 items-end'>
          {[
            { label: 'Full >50%', color: '#16a34a' },
            { label: 'Medium 30-50%', color: '#ca8a04' },
            { label: 'Low 10-30%', color: '#ea580c' },
            { label: 'Empty <10%', color: '#dc2626' },
          ].map(e => (
            <div key={e.label} className='flex-1'>
              <div className='h-3 rounded-full' style={{ backgroundColor: e.color }} />
              <div className='text-[11px] text-text-tertiary mt-1.5 text-center'>{e.label}</div>
            </div>
          ))}
        </div>
        <div className='mt-4 bg-surface-2 rounded-lg p-4 border border-border'>
          <div className='text-xs text-text-secondary mb-2'>Energy Bar Preview</div>
          <div className='w-full h-2 bg-surface-4 rounded-full overflow-hidden'>
            <div className='h-full rounded-full bg-gradient-to-r from-energy-full via-energy-medium to-energy-full' style={{ width: '64%' }} />
          </div>
          <div className='text-[11px] text-text-tertiary mt-1'>⚡ 3,200 / 5,000</div>
        </div>
      </Section>

      <Section title='Role Colors — 角色色'>
        <div className='grid grid-cols-5 gap-3'>
          {[
            { role: '程序员', color: '#059669', en: 'Programmer' },
            { role: '运营/PM', color: '#2563eb', en: 'Ops / PM' },
            { role: '设计师', color: '#db2777', en: 'Designer' },
            { role: '创始人', color: '#d97706', en: 'Founder' },
            { role: '通用', color: '#6b6b68', en: 'General' },
          ].map(r => (
            <div key={r.role} className='bg-surface-2 border border-border rounded-lg p-4 text-center'>
              <div className='w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg' style={{ backgroundColor: r.color + '20', border: `2px solid ${r.color}` }}>
                <span style={{ color: r.color }}>A</span>
              </div>
              <div className='text-xs font-medium text-text-primary'>{r.role}</div>
              <div className='text-[11px] text-text-muted'>{r.en}</div>
              <div className='text-[11px] font-mono text-text-tertiary mt-1'>{r.color}</div>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  )
}
