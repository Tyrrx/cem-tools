# Custom Element (Web Component) VS Code Integration

This package generates custom data config files for [VS Code](https://code.visualstudio.com/) using the Custom Element Manifest.

This config enables VS Code to display autocomplete and contextual information about your custom elements.

![demo of eslint validation for custom elements](https://github.com/break-stuff/cem-plugin-vs-code-custom-data-generator/blob/main/demo/images/eslint/custom_element_eslint_demo.gif?raw=true)

## Usage

This package includes two ways to generate the custom data config file: 
1. calling a function in your build pipeline 
2. as a plugin for the [Custom Element Manifest Analyzer](https://custom-elements-manifest.open-wc.org/)

### Install

```bash
npm i -D custom-element-vs-code-integration
```

### Build Pipeline

```js
import { generateVsCodeCustomElementData } from "custom-element-vs-code-integration";
import manifest from "./path/to/custom-elements.json";

const options = {...};

generateVsCodeCustomElementData(manifest, options);
```

### CEM Analyzer

#### Set-up

Ensure the following steps have been taken in your component library prior to using this plugin:

- Install and set up the [Custom Elements Manifest Analyzer](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/)
- Create a [config file](https://custom-elements-manifest.open-wc.org/analyzer/config/#config-file)

#### Import

```js
// custom-elements-manifest.config.js

import { customElementVsCodePlugin } from "custom-element-vs-code-integration";

const options = {...};

export default {
  plugins: [
    customElementVsCodePlugin(options)
  ],
};
```

## Implementation

If you don't have it already, add a VS Code settings folder and file at the root of your project - `.vscode/settings.json`. Then add or append the following code:

```json
{
  "html.customData": ["./vscode.html-custom-data.json"],
  "css.customData": ["./vscode.css-custom-data.json"]
}
```

If this is included in your `npm` package, the VS Code configuration will look something like this:

```json
{
  "html.customData": [
    "./node_modules/my-component-library/vscode.html-custom-data.json"
  ],
  "css.customData": [
    "./node_modules/my-component-library/vscode.css-custom-data.json"
  ]
}
```

**_Note:_** The path is relative to the root of the project, not the settings file.

Once it has been added, you will need to restart VS Code in order for it to register the new components. After it has been restarted, you should see autocomplete information for your custom elements!

## Configuration

The configuration has the following optional parameters:

```ts
{
  /** Path to output directory */
  outdir?: string;
  /** Name of the file with you component's custom HTML data */
  htmlFileName?: string | null;
  /** Name of the file with you component's custom CSS data */
  cssFileName?: string | null;
  /** Class names of any components you would like to exclude from the custom data */
  exclude?: string[];
  /** The property name from the component object that you would like to use for the description of your component */
  descriptionSrc?: "description" | "summary" | string;
  /** Displays the slot section of the element description */
  hideSlotDocs?: boolean;
  /** Displays the event section of the element description */
  hideEventDocs?: boolean;
  /** Displays the CSS custom properties section of the element description */
  hideCssPropertiesDocs?: boolean;
  /** Displays the CSS parts section of the element description */
  hideCssPartsDocs?: boolean;
  /** Displays the methods section of the element description */
  hideMethodDocs?: boolean;
  /** Overrides the default section labels in the component description */
  labels?: {
    slots?: string;
    events?: string;
    cssProperties?: string;
    cssParts?: string;
    methods?: string;
  };
  /** Creates reusable CSS values for consistency in components */
  cssSets?: CssSet[];
  /** Used to create an array of links within the component info bubble */
  referencesTemplate?: (name: string, tag?: string) => Reference[];
  /** The property form your CEM component object to display your types */
  typesSrc?: string;
  /** Hides logs produced by the plugin */
  hideLogs?: boolean;
  /** Prevents plugin from executing */
  skip?: boolean;
}
```

### Sample Config

```js
{
  /** Output directory to write the React wrappers to - default is the root of the project */
  outdir: "dist",

  /** Name of the file with you component's custom HTML data */
  htmlFileName: "my-library.html-custom-data.json",

  /** Name of the file with you component's custom CSS data */
  cssFileName: "my-library.css-custom-data.json",

  /** class names of any components you would like to exclude from the custom data */
  exclude: ["MyInternalElement"],

  /** The property name from the component object that you would like to use for the description of your component */
  descriptionSrc: "description",

  /** Displays the slot section of the element description */
  hideSlotDocs: false,

  /** Displays the event section of the element description */
  hideEventDocs: false,

  /** Displays the CSS custom properties section of the element description */
  hideCssPropertiesDocs: false,

  /** Displays the CSS parts section of the element description */
  hideCssPartsDocs: false,

  /** Displays the methods section of the element description */
  hideMethodDocs: true,

  /** Overrides the default section labels in the component description */
  labels: {
    slots: "Slot Section",
    events: "Custom Events",
    cssProperties: "CSS Variables",
    cssParts: "Style Hooks",
    methods: "Functions",
  },
  
  /** Creates reusable CSS values for consistency in components */
  cssSets: [
    {
      name: "radiuses",
      values: [
        { name: "--radius-sm", description: "2px" },
        { name: "--radius-md", description: "4px" },
        { name: "--radius-lg", description: "8px" },
      ],
    },
  ],

  /** Used to create an array of links within the component info bubble */
  referencesTemplate: (name: string, tag?: string) => [{
    name: 'Documentation',
    url: `https://example.com/components/${tag}`
  }],

  /** The property form your CEM component object to display your types */
  typesSrc: 'expandedType'
}
```

## Example

Here is a basic example of a component configuration using jsDoc:

````ts
/**
 *
 * Radio groups are used to group multiple radio buttons so they function as a single form control.
 *
 * Here is the [documentation](https://my-site.com/docs.md).
 *
 * Use it like this:
 * ```html
 * <radio-group value="2" size="3">
 *   <span slot="label">My Label</span>
 *   <radio-button value="1">Option 1</radio-button>
 *   <radio-button value="2">Option 2</radio-button>
 *   <radio-button value="3">Option 3</radio-button>
 * </radio-group>
 * ```
 *
 * @tag radio-group
 * @tagname radio-group
 *
 * @attr {boolean} disabled - Disables the element
 * @attribute {string} value - The value of the selected radio
 * @attribute {1,2,3,4} size - This will control the size of radio buttons
 *
 * @csspart bar - Styles the bar element
 *
 * @slot - add radio buttons to the `default` slot to create options to your radio group
 * @slot label - placeholder for the radio group label
 *
 * @cssprop {--radius-sm|--radius-md|--radius-lg} --border-radius - Controls the color of foo
 * @cssproperty [--background-color=red] - Controls the color of bar
 *
 * @prop {boolean} prop1 - this toggles some unseen feature
 * @property {number} prop2 - this will adjust the width of the unit
 *
 * @fires custom-event - some description for custom-event
 * @fires {Event} typed-event - some description for typed-event
 * @event {CustomEvent} typed-custom-event - some description for typed-custom-event
 *
 */
class RadioGroup extends HTMLElement {}
````

## Omitting File Output

If you would like to exclude the HTML or CSS output, you can do so by setting the `htmlFileName` or `cssFileName` properties to `null`.

## Tag Mapping

![an example of the jsDoc tags used to create the custom data file](https://github.com/break-stuff/cem-plugin-vs-code-custom-data-generator/blob/main/demo/images/tags.png?raw=true)

| Tag                      | Description                                                                                                                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@summary` / description | This provides the description for the custom element when autocomplete is used or the element is hovered. If no summary is provided, it will fall back to the `description` if it is available.                                         |
| `@attr` / `@attribute`   | This will provide descriptions for each attribute. If you use union types in TypeScript or in the description, these will display as autocomplete options. Values can also be defined in the jsDoc using comma or pipe delimited values |

The `@summary` and `@attr` / `@attribute` descriptions have limited markdown support and enable you to style text, create links, and add code snippets.

### Descriptions

Using the `descriptionSrc` configuration, you can determine the source of the text that gets displayed in the editor autocomplete bubble. This is useful if you want to provide alternate descriptions for your React users.

If no value is provided, the plugin will use the `summary` property and then fall back to the `description` property if a summary is not available.

![description section of autocomplete popup from vs code](https://github.com/break-stuff/cem-plugin-vs-code-custom-data-generator/blob/main/demo/images/description.png?raw=true)

**Note:** _Descriptions support multiple lines by breaking the comment up into multiple lines whereas summaries do not and will need to be manually added using `\n`._

````js
// description example

/**
 *
 * Radio groups are used to group multiple radios or radio buttons so they function as a single form control. Here is its [documentation](https://my-docsite.com).
 *
 * Use it like this:
 * ```html
 * <radio-group value="2" size="3">
 *   <span slot="label">My Label</span>
 *   <radio-button value="1">Option 1</radio-button>
 *   <radio-button value="2">Option 2</radio-button>
 *   <radio-button value="3">Option 3</radio-button>
 * </radio-group>
 * ```
 *
 */
````

````js
// summary example

/**
 *
 * @summary Radios buttons allow users to select a single option from a group. Here is its [documentation](https://my-site.com/documentation).\n\nUse it like this:\n```html\n<radio-button value="1" disabled>Your label</radio-button>\n```
 *
 * /
````

## Slot Documentation

Slot information will display with the element description during autocompletion or when hovered over. This section can be hidden by setting `hideSlotDocs` to `true` in the config.

![slot section of autocomplete popup from vs code](https://github.com/break-stuff/cem-plugin-vs-code-custom-data-generator/blob/main/demo/images/slots.png?raw=true)

## Event Documentation

Event information will display with the element description during autocompletion or when hovered over. This section can be hidden by setting `hideEventDocs` to `true` in the config.

![events section of autocomplete popup from vs code](https://github.com/break-stuff/cem-plugin-vs-code-custom-data-generator/blob/main/demo/images/events.png?raw=true)

## Method Documentation

Methods will display if they are `public` and have a description. This section can be hidden by setting `hideMethodDocs` to `true` in the config.

## CSS Documentation

Component-specific [CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) and [CSS Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) are included in the component documentation. These can be hidden using the `cssPropertiesDocs` and `cssPartsDocs` configuration options respectively.

![css properties and css parts sections of autocomplete popup from vs code](https://github.com/break-stuff/cem-plugin-vs-code-custom-data-generator/blob/main/demo/images/css.png?raw=true)

## Documentation Labels

There may be instances where you may want to translate or override the default section headers. Using the `labels` configuration you can change one or all of the headers for the component description sections.

```js
// custom-elements-manifest.config.js
export default {
  plugins: [
    generateCustomData({
      ...

      /** Overrides the default section labels in the component description */
      labels: {
        slots: "Placeholders",
        events: "事件",
        cssProperties: "Propiedades CSS",
        cssParts: "Style Hooks",
        methods: "Actions"
      },
    }),
  ],
};
```

## CSS Custom Data

Adding the CSS Custom Data file to your config provides you with autocomplete for your component's CSS custom properties.

These values can be added in your component's jsDoc. The `var()` wrapper will be added automatically if they are prefixed with `--`.

```ts
/**
 *
 * @cssprop {--radius-sm|--radius-md|--radius-lg} --border-radius - Controls the border radius of the component
 *
 */
```

### CSS Sets

You can define reusable CSS values to simplify your efforts and provide greater consistency from one component to another.

First, define your sets in the config. Values can be an object array with a name and optional description or they can be a simple string array.

```js
const options = {
  cssSets: [
    {
      name: "radiuses",
      values: [
        { name: "--radius-sm", description: "2px" },
        { name: "--radius-md", description: "4px" },
        { name: "--radius-lg", description: "8px" },
      ],
    },
    {
      name: "spacing",
      values: ["2px", "4px", "8px", "12px", "16px"],
    },
  ],
};
```

Once they are defined, you can reference them in your components jsDoc by prefixing it with `set:` and providing the name of the set.

```ts
/**
 *
 * @cssprop {set:radiuses} --border-radius - Controls the border radius of the component
 *
 */
```

![css custom property autocomplete from vs code](https://github.com/break-stuff/cem-plugin-vs-code-custom-data-generator/blob/main/demo/images/css_autocomplete.gif?raw=true)

### CSS Parts

Developers will also receive autocomplete for defined CSS parts.

```ts
/**
 *
 * @csspart radio-label - Applies custom styles the radio group label
 *
 */
```

![css custom property autocomplete from vs code](https://github.com/break-stuff/cem-plugin-vs-code-custom-data-generator/blob/main/demo/images/css_part.gif?raw=true)

## References

At the bottom of each component info popup there is a place where you can set a list of links. The options provide a hook that will allow you to add your own links to the popup. A popular usage is linking to documentation. This is especially nice if you have versioned documentation, so you provide developers with contextual help by linking them directly to the version of the documentation they are using.

```ts
const options = {
  ...
  referencesTemplate: (name, tag) => [{
    name: 'Documentation',
    url: `https://example.com/${version}/components/${tag}`
  }]
}
```

Another capability is adding conditional documentation based on the component.

```ts
const options = {
  ...
  referencesTemplate: (name, tag) => {
    references = [];

    if(name = 'MyInput') {
      references.push({
        name: 'MDN',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input'
      });
    }

    return references;
  }
}
```

## Custom Types

If you are generating a custom types property on your CEM component object and you would like to reference that instead of the default type, you can use the `typesSrc` option to specify the name of the property. If none is specified or if no value is found, it will fall back to the `type` property. If you are using the CEM Analyzer, you can leverage [this tool](https://www.npmjs.com/package/cem-plugin-expanded-types) to generate expanded types.

## Scoping Tags

If your project is scoping components using prefixes or suffixes in the tag name, you can generate a custom data config file using your scoping using the `prefix` or `suffix` option (`prefix: "test_"` => `test_my-element`).