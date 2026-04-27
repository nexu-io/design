"use client";

import type { ComponentType } from "react";

import { BadgeBasicExample } from "../examples/components/badge/basic";
import { ButtonBasicExample } from "../examples/components/button/basic";
import { ButtonLoadingExample } from "../examples/components/button/loading";
import { ButtonVariantsExample } from "../examples/components/button/variants";
import { CardBasicExample } from "../examples/components/card/basic";
import { CheckboxBasicExample } from "../examples/components/checkbox/basic";
import { DialogBasicExample } from "../examples/components/dialog/basic";
import { InputBasicExample } from "../examples/components/input/basic";
import { SelectBasicExample } from "../examples/components/select/basic";
import { SwitchBasicExample } from "../examples/components/switch/basic";
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
} satisfies Record<ExampleId, ComponentType>;

export function ExampleRenderer({ id }: { id: ExampleId }) {
  const Example = exampleComponents[id];

  return <Example />;
}
