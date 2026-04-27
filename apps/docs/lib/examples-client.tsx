"use client";

import type { ComponentType } from "react";

import { AlertBasicExample } from "../examples/components/alert/basic";
import { BadgeBasicExample } from "../examples/components/badge/basic";
import { ButtonBasicExample } from "../examples/components/button/basic";
import { ButtonLoadingExample } from "../examples/components/button/loading";
import { ButtonVariantsExample } from "../examples/components/button/variants";
import { CardBasicExample } from "../examples/components/card/basic";
import { CheckboxBasicExample } from "../examples/components/checkbox/basic";
import { DialogBasicExample } from "../examples/components/dialog/basic";
import { DropdownMenuBasicExample } from "../examples/components/dropdown-menu/basic";
import { InputBasicExample } from "../examples/components/input/basic";
import { PopoverBasicExample } from "../examples/components/popover/basic";
import { SelectBasicExample } from "../examples/components/select/basic";
import { SkeletonBasicExample } from "../examples/components/skeleton/basic";
import { SpinnerBasicExample } from "../examples/components/spinner/basic";
import { SwitchBasicExample } from "../examples/components/switch/basic";
import { TabsBasicExample } from "../examples/components/tabs/basic";
import { TooltipBasicExample } from "../examples/components/tooltip/basic";
import type { ExampleId } from "./examples";

const exampleComponents = {
  "button/basic": ButtonBasicExample,
  "button/variants": ButtonVariantsExample,
  "button/loading": ButtonLoadingExample,
  "input/basic": InputBasicExample,
  "card/basic": CardBasicExample,
  "badge/basic": BadgeBasicExample,
  "checkbox/basic": CheckboxBasicExample,
  "switch/basic": SwitchBasicExample,
  "select/basic": SelectBasicExample,
  "dialog/basic": DialogBasicExample,
  "tabs/basic": TabsBasicExample,
  "tooltip/basic": TooltipBasicExample,
  "popover/basic": PopoverBasicExample,
  "dropdown-menu/basic": DropdownMenuBasicExample,
  "alert/basic": AlertBasicExample,
  "spinner/basic": SpinnerBasicExample,
  "skeleton/basic": SkeletonBasicExample,
} satisfies Record<ExampleId, ComponentType>;

export function ExampleRenderer({ id }: { id: ExampleId }) {
  const Example = exampleComponents[id];

  return <Example />;
}
