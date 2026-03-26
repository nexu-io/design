import { axe } from 'vitest-axe'

export async function expectNoA11yViolations(
  container: HTMLElement,
  axeOptions?: Parameters<typeof axe>[1]
) {
  const results = await axe(container, {
    ...axeOptions,
    rules: {
      'color-contrast': { enabled: false },
      ...(axeOptions?.rules ?? {}),
    },
  })

  expect(results.violations).toEqual([])
}
