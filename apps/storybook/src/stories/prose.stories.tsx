import type { Meta, StoryObj } from "@storybook/react-vite";

import { Prose } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Prose",
  component: Prose,
  tags: ["autodocs"],
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleHTML = `
<h1>Markdown Preview</h1>
<p>This is a <strong>prose</strong> component that provides consistent styling for rendered markdown content, including <em>emphasis</em>, <a href="#">links</a>, and inline <code>code</code>.</p>
<h2>Lists</h2>
<ul>
  <li>First item</li>
  <li>Second item with <strong>bold</strong></li>
  <li>Third item</li>
</ul>
<h2>Code Block</h2>
<pre><code>const greeting = 'Hello, world!'
console.log(greeting)</code></pre>
<h2>Blockquote</h2>
<blockquote>
  <p>Design is not just what it looks like. Design is how it works.</p>
</blockquote>
<h2>Table</h2>
<table>
  <thead>
    <tr><th>Token</th><th>Value</th><th>Usage</th></tr>
  </thead>
  <tbody>
    <tr><td>surface-0</td><td>#fafafa</td><td>Page background</td></tr>
    <tr><td>surface-1</td><td>#ffffff</td><td>Card background</td></tr>
  </tbody>
</table>
<hr />
<p>End of preview.</p>
`;

export const Default: Story = {
  render: () => <Prose className="max-w-2xl" dangerouslySetInnerHTML={{ __html: sampleHTML }} />,
};

export const Compact: Story = {
  render: () => (
    <Prose size="compact" className="max-w-xl" dangerouslySetInnerHTML={{ __html: sampleHTML }} />
  ),
};
