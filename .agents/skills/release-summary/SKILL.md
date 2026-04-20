---
name: release-summary
description: Draft release summaries, changelog summaries, version PR notes, and changeset-friendly package release notes for npm packages or monorepos. Use this whenever the user asks to write a release summary, 发版说明, release notes, changelog entry, version PR summary, package publish notes, or wants the agent to summarize what will be released from git history, diffs, or changesets, especially for ui libraries, design systems, and multi-package workspaces.
---

# Release Summary

Use this skill to produce concise, consumer-facing release summaries from the repository state.

## Goals

- Save the user from manually writing release notes.
- Prefer consumer-visible impact over implementation detail.
- Work well for monorepos with multiple publishable packages.
- Reuse changesets, git diff, and recent commits instead of guessing.

## When to use

Use this skill when the user asks for any of the following:

- “帮我写 release summary”
- “生成发版说明”
- “写 changelog”
- “给 version PR 写摘要”
- “总结这次 ui-web / tokens 要发什么”
- “根据 changeset 帮我整理 release notes”
- “draft release notes” / “write package release notes”

This skill is especially relevant when:

- the repo uses Changesets
- there are multiple packages in one release
- the user wants package-by-package notes
- the user wants Chinese or bilingual release notes

## Inputs to inspect

Gather only the smallest set of evidence needed:

1. unreleased `.changeset/*.md` files when present
2. `package.json` names and versions for affected publishable packages
3. `git diff` or `git log` for the branch or version PR if needed
4. docs describing release flow when they help interpret package roles

Prefer changesets first because they usually reflect intended consumer-facing changes.

## Workflow

1. Identify the release scope.
   - Which package(s) are being released?
   - Is this a normal release, version PR, or ad hoc draft?

2. Read release signals in this order:
   - changeset files
   - package versions
   - commit messages or git diff

3. Group changes by package.
   - For a monorepo, keep each public package separate.
   - If one package is upstream of another, mention the relationship briefly.

4. Rewrite raw implementation notes into consumer language.
   - Good: `adds new button variants for compact actions`
   - Bad: `refactors CVA config and updates classes`

5. Call out migration risk only when real.
   - mention breaking changes
   - mention required CSS, token, or theme updates
   - otherwise say nothing rather than inventing risk

6. Produce the final summary in the format the user asked for.
   - default: concise Markdown in English

## Output format

Unless the user asks otherwise, use this structure:

```md
## Release Summary

### `package-name`
- item 1
- item 2

### `package-name-2`
- item 1

## Upgrade Notes
- note only if users need to do something
```

If only one package is involved, omit empty sections.

## Writing rules

- Focus on what changed for consumers.
- Keep bullets short and concrete.
- Avoid internal-only details unless they affect users.
- Do not copy raw commit messages if they are noisy.
- Do not mention packages that are not part of the release.
- If evidence is incomplete, say what you are inferring.

## Monorepo guidance

For multi-package releases:

- separate notes by package name
- avoid repeating the same point across packages
- if `tokens` changed and `ui-web` consumes those changes, mention that relationship once
- if a package has no consumer-visible changes, do not pad the notes

## Changesets guidance

When `.changeset/*.md` files exist:

- treat them as the primary release source
- merge duplicate or overlapping notes
- preserve semver intent if relevant to the summary
- rewrite terse engineering text into cleaner release language

## Examples

### Example 1
Input: `帮我给 ui-web 和 tokens 生成这次发版 summary`

Output:

```md
## Release Summary

### `@nexu-design/tokens`
- publishes the shared token package with theme variables and CSS primitives

### `@nexu-design/ui-web`
- publishes the React component library built on top of the shared token package
- allows consumers to install the package from npm and import the published stylesheet directly
```

### Example 2
Input: `write a short version PR summary for the upcoming package release`

Output:

```md
## Release Summary

- publishes updated package versions for the pending Changesets in this branch
- includes coordinated updates for the affected public packages and their internal version ranges
```

## If the user wants a changeset body

If the user explicitly asks for text to paste into a changeset file:

- keep it tighter than release notes
- mention only the affected package(s)
- prefer 1-3 sentences, not a long changelog

## If the user wants a GitHub release body

Expand slightly:

- include a one-line overview at top
- then package sections
- then optional upgrade notes

## Repo-specific hint for Nexu Design

When working in the Nexu Design repository:

- prioritize `@nexu-design/ui-web` and `@nexu-design/tokens`
- treat token changes as upstream to ui-web
- prefer concise English summaries unless the user asks for another language
