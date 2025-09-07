# AG UI Kit

**AG UI Kit** is a lightweight, fully customizable React component library for building modern UI components. Currently, it includes a versatile **Select** component with support for single and multiple selections, custom styling, and arbitrary HTML attributes. Future updates will add more universal components.

---

## 📦 Installation

```bash
npm install ag-ui-kit
```

Or 

```bash
yarn add ag-ui-kit
```


## Demo

Basic Select

```javascript

import React from "react";
import { Select, Option } from "ag-ui-kit";

export default function App() {
  return (
    <Select onChange={(val) => console.log(val)}>
      <Option value="car">Car</Option>
      <Option value="bike">Bike</Option>
    </Select>
  );
}

```

Multiple Selection

```javascript

<Select multiple onChange={(val) => console.log(val)}>
  <Option value="car">Car</Option>
  <Option value="bike">Bike</Option>
  <Option value="bus">Bus</Option>
</Select>

```

Custom Arrow

```javascript

<Select
  onChange={(val) => console.log(val)}
  arrowOpen={<span>🔼</span>}
  arrowClosed={<span>🔽</span>}
>
  <Option value="car">Car</Option>
  <Option value="bike">Bike</Option>
</Select>
```

Custom Styling

```javascript

<Select className="my-select" onChange={(val) => console.log(val)}>
  <Option value="car" className="my-option">Car</Option>
  <Option value="bike" className="my-option">Bike</Option>
</Select>

```

## Props

| Prop          | Type                                  | Default     | Description                                                             |
| ------------- | ------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| `value`       | `string \| string[]`                  | `undefined` | Selected value(s)                                                       |
| `onChange`    | `(value: string \| string[]) => void` | `undefined` | Callback when selection changes                                         |
| `multiple`    | `boolean`                             | `false`     | Enables multi-select                                                    |
| `arrowOpen`   | `ReactNode`                           | `"▲"`       | Custom icon when dropdown is open                                       |
| `arrowClosed` | `ReactNode`                           | `"▼"`       | Custom icon when dropdown is closed                                     |
| `className`   | `string`                              | `""`        | Custom CSS class for the Select container                               |
| `...rest`     | `HTMLAttributes<HTMLDivElement>`      | `undefined` | Any additional HTML attributes (`id`, `style`, `ref`, `disabled`, etc.) |


### `Option` component

| Prop        | Type                             | Default     | Description                    |
| ----------- | -------------------------------- | ----------- | ------------------------------ |
| `value`     | `string`                         | —           | Option value                   |
| `children`  | `ReactNode`                      | —           | Option label                   |
| `disabled`  | `boolean`                        | `false`     | Disable this option            |
| `className` | `string`                         | `""`        | Custom CSS class               |
| `...rest`   | `HTMLAttributes<HTMLDivElement>` | `undefined` | Any additional HTML attributes |


## Styling

The library uses default CSS classes that can be overridden by consumer classes:

* cs-select → container
* cs-control → main select box
* cs-arrow → dropdown arrow
* cs-dropdown → options container
* cs-option → each option
* cs-option--selected → selected option
* cs-option--disabled → disabled option

You can provide your own class using `className` props for both `Select` and `Option`

## Future Components

This package is designed to be universal. Additional components such as buttons, modals, inputs, and cards will be added in future releases. All components will follow the same customizable and independent structure.
## Usage/Examples

```javascript
import React from "react";
import { Select, Option } from "ag-ui-kit";

export default function Example() {
  return (
    <Select
      multiple
      className="custom-select"
      arrowOpen={<span>🔼</span>}
      arrowClosed={<span>🔽</span>}
      onChange={(value) => console.log("Selected:", value)}
    >
      <Option value="apple" className="custom-option">Apple</Option>
      <Option value="banana" disabled>Banana</Option>
      <Option value="cherry">Cherry</Option>
    </Select>
  );
}

```

