import { render, screen } from '@testing-library/react'

import { Sheet, SheetContent, SheetDescription, SheetTitle } from './sheet'

describe('Sheet', () => {
  it('renders content when open', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>Configure workspace details</SheetDescription>
        </SheetContent>
      </Sheet>
    )

    expect(screen.getByText('Workspace settings')).toBeInTheDocument()
    expect(screen.getByText('Configure workspace details')).toBeInTheDocument()
  })
})
