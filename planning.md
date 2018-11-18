# Chores
- organize labels
- create project board
- setup Node version manager
- setup workflow (PR template)
- setup Travis
- setup project page (docs folder, as demo)

# Features

## MVP
- readme (documentation)
- code
  - Typescript (with ES modules)
  - LESS
  - Handlebars
- generated documentation
  - nav menu (home; list of schemas)
  - readme (generated webpage, with default; GFM styling)
  - page for each schema
- Handlebars templates
  - index.hbs - main page for generated documentation
  - page.hbs - page for each top-level schema
  - schema.hbs - template for each (sub)schema
- support HTML in Markdown
- run from command line and Node.js (LTS)
- supports JSON Schema Draft 07 (only)
- test with real schema data
- test command line
- test Node.js
- automated testing using Travis
- automated deployment to npm using Travis
- custom CSS
- custom readme

## Wishlist
- button to expand / collapse all schemas (#57)
- submit to JSON Schema's documentation (#68)
