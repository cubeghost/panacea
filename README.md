# panacea - diy health tracking app

optimized for my personal preferences but with customization in mind

ideas
- quick entries: when i have a migraine i don't want to have to enter details right now. i can come back and do that later (default view will have "recent entries")
- color scales: because why not (and [i've been toying with this for years](https://codepen.io/cubeghost/pen/rawVbr))
- versioned schemas for entry types
- generic "notes" record that's just timestamp and text

### todo
- styling
- drag and drop to reorder fields
- quick entry shortcut
- map entries to calendar

### development

`yarn dev`

prisma (postgres) + remix on netlify
passwordless auth

(records === "entries")