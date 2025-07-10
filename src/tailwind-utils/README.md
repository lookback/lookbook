Utils in here must be defined with the `@utility` Tailwind syntax.

[Tailwind docs](https://tailwindcss.com/docs/adding-custom-styles#adding-custom-utilities).

The reason is that we can't nest `@utility` in CSS layers, so this directory's files are imported without a `layer()` declaration.
