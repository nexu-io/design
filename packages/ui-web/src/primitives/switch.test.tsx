import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Switch } from './switch'

describe('Switch', () => {
  it('toggles checked state', async () => {
    const user = userEvent.setup()

    render(<Switch aria-label="Notifications" />)

    const control = screen.getByRole('switch', { name: 'Notifications' })
    expect(control).toHaveAttribute('data-state', 'unchecked')

    await user.click(control)

    expect(control).toHaveAttribute('data-state', 'checked')
  })
})
