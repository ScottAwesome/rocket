# Web Menu

Gathers information about your static html pages and creates menus for it.

## Features

- Very fast (uses wasm & html streaming for parsing)
- Comes with multiple pre defined menu like header, nested, breadcrumb, tableOfContents, ...
- Menus are accessible and fully style able
- Works with any tool that outputs html
- Typically reduces the tools build time by offloading menu generation
- Flexible rendering system for menus via 4 plain javascript functions (render, list, listItem, link)
- Low dependency count

## Installation

```
npm i -D @web/menu
```

## Usage

```
npx web-menu
```

## Usage as a html user

Write your html as you normally would but don't include any menus.
Where you want to place a menu put `<web-menu type="header"></web-menu>`.
When you run `npx web-menu` it will insert the menu into this tag.

## Configuration file

You can put configurations at

- `config/web-menu.js`
- `config/web-menu.mjs`
- `web-menu.config.js`
- `web-menu.config.mjs`

```js
export default {
  docsDir: 'my-menu/',
  outputDir:
}
```

<details>
  <summary>Types of the config file</summary>
  <div>
    TODO: inline types 
  </div>
</details>

## Add your own menu type

```js
import { Menu } from '@web/menu'

class MyMenu extends Menu {
  static name = 'my-menu';
  
  async render() {
    return '--- My Menu ---';
  }
}


export default {
  docsDir: 'my-menu/',
  presets: [
    addPlugin(MyMenu)
  ],
  presets: {
    myMenu: {
      async render() {
        return '--- My Menu ---';
      },
    },
  },
};
```

## Menu types

1. **header**

   - starts at level 1
   - flat list of links
   - commonly used as a top bar navigation of "sections"

   ```html
   <web-menu preset="header">
     <nav aria-label="Header">
       <a href="/about/">About</a>
       <a href="/components/" aria-current="page">Components</a>
     </nav>
   </web-menu>
   ```

2. **nested**

   - starts at level 1
   - nested ul/li list

   ```html
   <web-menu preset="nested">
     <nav aria-label="Main">
       <ul>
         <li><a href="/about/">About</a></li>
         <li>
           <a href="/components/">Components</a>
           <ul class="lvl-2">
             <li><a href="/about/accordion/">Accordion</a></li>
             <li><a href="/about/tabs/">Tabs</a></li>
           </ul>
         </li>
       </ul>
     </nav>
   </web-menu>
   ```

3. **main**

   - starts at level 2
   - nested ul/li list
   - level 2 becomes a not clickable category heading if it has children
   - level 3+ becomes a `detail/summary` element needing a click if it has children
   - ideally used in combination with `header`

   ```html
   <web-menu preset="main">
     <nav aria-label="main">
       <ul class="lvl-2">
         <li class="web-menu-active">
           <span>Content</span>
           <ul class="lvl-3">
             <li class="web-menu-active">
               <details open>
                 <summary>Accordion</summary>
                 <ul class="lvl-4">
                   <li class="web-menu-current">
                     <a href="/components/content/accordion/overview/" aria-current="page"
                       >Overview</a
                     >
                   </li>
                   <li><a href="/components/content/accordion/api/">API</a></li>
                 </ul>
               </details>
             </li>
           </ul>
         </li>
         <li>
           <span>Inputs</span>
           <ul class="lvl-3">
             <li><a href="/components/inputs/input-text/">Input Text</a></li>
             <li><a href="/components/inputs/textarea/">Textarea</a></li>
           </ul>
         </li>
       </ul>
     </nav>
   </web-menu>
   ```

4. **breadcrumb**

   - starts at root and goes the tree up to the current page
   - flat ol/li list

   ```html
   <web-menu preset="breadcrumb">
     <nav aria-label="Breadcrumb">
       <ol>
         <li class="web-menu-active"><a href="/">Home</a></li>
         <li class="web-menu-active"><a href="/components/">Components</a></li>
         <li class="web-menu-current">
           <a href="/components/button-blue/" aria-current="page">Button Blue</a>
         </li>
       </ol>
     </nav>
   </web-menu>
   ```

5. **articleOverview**

   - shows a flat list of pages
   - includes multiple meta data like cover image, heading, subHeading, authors, ...
   - typically displayed as a grid

   ```html
   <web-menu preset="articleOverview">
     <div>
       <article class="post">
         <div class="cover">
           <a href="/blog/new-year-new-challenge/" tabindex="-1" aria-hidden="true">
             <figure>
               <img src="..." />
             </figure>
           </a>
         </div>
         <a href="/blog/new-year-new-challenge/">
           <h2>New year means new challenges</h2>
         </a>
         <div class="description">
           <a href="/blog/new-year-new-challenge/" tabindex="-1">
             <p>It is a new year and there are new challenges awaiting.</p>
           </a>
         </div>
       </article>

       <article class="post">
         <div class="cover">
           <a href="/blog/comparing-apple-to-oranges/" tabindex="-1" aria-hidden="true">
             <figure>
               <img src="..." />
             </figure>
           </a>
         </div>
         <a href="/blog/comparing-apple-to-oranges/">
           <h2>Comparing apple to oranges</h2>
         </a>
         <div class="description">
           <a href="/blog/comparing-apple-to-oranges/" tabindex="-1">
             <p>Say you have an apple and you then find an orange - what would you do?</p>
           </a>
         </div>
       </article>
     </div>
   </web-menu>
   ```

6. **tableOfContents**

   - lists the headlines of the current page in a hierarchy
   - nested ol/li list

   ```html
   <web-menu preset="tableOfContents">
     <aside>
       <h2>Contents</h2>
       <nav aria-label="Table of Contents">
         <ol class="lvl-2">
           <li>
             <a href="#every-headline">Every headline</a>
             <ol class="lvl-3">
               <li><a href="#will-be">will be</a></li>
             </ol>
           </li>
           <li><a href="#to-the">to the</a></li>
           <li><a href="#main-level">main level</a></li>
         </ol>
       </nav>
     </aside>
   </web-menu>
   ```

7. **next**

   - shows the next page in the tree
   - is either the first child or he next sibling

   ```html
   <web-menu preset="next">
     <a href="/second.html">
       <span>next</span>
       <span>Second</span>
     </a>
   </web-menu>
   ```

8. **previous**

   - shows the previous page in the tree
   - is either the previous sibling or the parent

   ```html
   <web-menu preset="previous">
     <a href="/first.html">
       <span>previous</span>
       <span>First</span>
     </a>
   </web-menu>
   ```
