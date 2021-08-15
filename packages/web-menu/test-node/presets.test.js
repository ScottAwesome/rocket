import chai from 'chai';
import chalk from 'chalk';
import { executeCli } from './test-helpers.js';

const { expect } = chai;

describe('presets', () => {
  before(() => {
    // ignore colors in tests as most CIs won't support it
    // chalk.level = 0;
  });

  it('breadcrumb', async () => {
    const { readOutput } = await executeCli(
      { docsDir: 'fixtures/preset-breadcrumb' },
      { captureLog: true },
    );

    const buttonBlue = await readOutput('components/button-blue/index.html');
    expect(buttonBlue).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Button Blue</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="breadcrumb">',
        '      <nav aria-label="Breadcrumb">',
        '        <ol>',
        '          <li class="web-menu-active"><a href="/">Home</a></li>',
        '          <li class="web-menu-active"><a href="/components/">Components</a></li>',
        '          <li class="web-menu-current">',
        '            <a href="/components/button-blue/" aria-current="page">Button Blue</a>',
        '          </li>',
        '        </ol>',
        '      </nav>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const buttonRed = await readOutput('components/button-red/index.html');
    expect(buttonRed).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Button Red</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="breadcrumb">',
        '      <nav aria-label="Breadcrumb">',
        '        <ol>',
        '          <li class="web-menu-active"><a href="/">Home</a></li>',
        '          <li class="web-menu-active"><a href="/components/">Components</a></li>',
        '          <li class="web-menu-current">',
        '            <a href="/components/button-red/" aria-current="page">Button Red</a>',
        '          </li>',
        '        </ol>',
        '      </nav>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const components = await readOutput('components/index.html');
    expect(components).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Components</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="breadcrumb">',
        '      <nav aria-label="Breadcrumb">',
        '        <ol>',
        '          <li class="web-menu-active"><a href="/">Home</a></li>',
        '          <li class="web-menu-current">',
        '            <a href="/components/" aria-current="page">Components</a>',
        '          </li>',
        '        </ol>',
        '      </nav>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const home = await readOutput('index.html');
    expect(home).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Preset Breadcrumb</title>',
        '    <meta name="menu:link.text" content="Home" />',
        '  </head>',
        '  <body>',
        '    <web-menu preset="breadcrumb">',
        '      <nav aria-label="Breadcrumb">',
        '        <ol>',
        '          <li class="web-menu-current"><a href="/" aria-current="page">Home</a></li>',
        '        </ol>',
        '      </nav>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );
  });

  it('header', async () => {
    const { readOutput } = await executeCli(
      { docsDir: 'fixtures/preset-header' },
      { captureLog: true },
    );

    const buttonRed = await readOutput('components/button-red/index.html');
    expect(buttonRed).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Button Red</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="header">',
        '      <nav aria-label="Header">',
        '        <a href="/about/">About</a>',
        '        <a href="/components/">Components</a>',
        '      </nav>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const components = await readOutput('components/index.html');
    expect(components).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Components</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="header">',
        '      <nav aria-label="Header">',
        '        <a href="/about/">About</a>',
        '        <a href="/components/" aria-current="page">Components</a>',
        '      </nav>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );
  });

  it('next-previous', async () => {
    const { readOutput } = await executeCli(
      { docsDir: 'fixtures/preset-next-previous' },
      { captureLog: true },
    );

    const index = await readOutput('index.html');
    expect(index).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Preset Next/Previous</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="previous"></web-menu>',
        '    <web-menu preset="next">',
        '      <a href="/first.html">',
        '        <span>next</span>',
        '        <span>First</span>',
        '      </a>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const first = await readOutput('first.html');
    expect(first).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>First</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="previous">',
        '      <a href="/">',
        '        <span>previous</span>',
        '        <span>Preset Next/Previous</span>',
        '      </a>',
        '    </web-menu>',
        '    <web-menu preset="next">',
        '      <a href="/second.html">',
        '        <span>next</span>',
        '        <span>Second</span>',
        '      </a>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const second = await readOutput('second.html');
    expect(second).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Second</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="previous">',
        '      <a href="/first.html">',
        '        <span>previous</span>',
        '        <span>First</span>',
        '      </a>',
        '    </web-menu>',
        '    <web-menu preset="next">',
        '      <a href="/third.html">',
        '        <span>next</span>',
        '        <span>Third</span>',
        '      </a>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const third = await readOutput('third.html');
    expect(third).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Third</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="previous">',
        '      <a href="/second.html">',
        '        <span>previous</span>',
        '        <span>Second</span>',
        '      </a>',
        '    </web-menu>',
        '    <web-menu preset="next"></web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );
  });

  it('article-overview', async () => {
    const { readOutput } = await executeCli(
      { docsDir: 'fixtures/plugin-article-overview' },
      { captureLog: true },
    );

    const blog = await readOutput('blog/index.html');
    expect(blog).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Blog Overview</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="article-overview">',
        '      <div>',
        '        <article class="post">',
        // '          <div class="cover">',
        // '            <a href="/blog/new-year-new-challenge/" tabindex="-1" aria-hidden="true">',
        // '              <figure>',
        // '                <img ../>',
        // '              </figure>',
        // '            </a>',
        // '          </div>',
        '          <a href="/blog/new-year-new-challenge/">',
        '            <h2>New year means new challenges</h2>',
        '          </a>',
        // '          <div class="authors">',
        // '            [[ authors image + name each linked ]]',
        // '            <time>Updated: Sep 6, 2021</time>',
        // '          </div>',
        '',
        '          <div class="description">',
        '            <a href="/blog/new-year-new-challenge/" tabindex="-1">',
        '              <p>It is a new year and there are new challenges awaiting.</p>',
        '            </a>',
        // '            <div class="tags">',
        // '              <a href="/blog/tags/capabilities/">Capabilities</a> ',
        // '              <a href="/blog/tags/games/">Games</a>',
        // '            </div>',
        '          </div>',
        '        </article>',
        '',
        '        <article class="post">',
        '          <a href="/blog/comparing-apple-to-oranges/">',
        '            <h2>Comparing apple to oranges</h2>',
        '          </a>',
        '',
        '          <div class="description">',
        '            <a href="/blog/comparing-apple-to-oranges/" tabindex="-1">',
        '              <p>Say you have an apple and you then find an orange - what would you do?</p>',
        '            </a>',
        '          </div>',
        '        </article>',
        '      </div>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );
  });

  it('nestedWithCategoryHeading', async () => {
    const { readOutput } = await executeCli(
      { docsDir: 'fixtures/preset-main' },
      { captureLog: true },
    );

    const accordionOverview = await readOutput('components/content/accordion/overview/index.html');
    expect(accordionOverview).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Overview</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="main">',
        '      <nav aria-label="main">',
        '        <ul class="lvl-2">',
        '          <li class="web-menu-active">',
        '            <span>Content</span>',
        '',
        '            <ul class="lvl-3">',
        '              <li class="web-menu-active">',
        '                <details open>',
        '                  <summary>Accordion</summary>',
        '                  <ul class="lvl-4">',
        '                    <li class="web-menu-current">',
        '                      <a href="/components/content/accordion/overview/" aria-current="page"',
        '                        >Overview</a',
        '                      >',
        '                    </li>',
        '                    <li><a href="/components/content/accordion/api/">API</a></li>',
        '                  </ul>',
        '                </details>',
        '              </li>',
        '            </ul>',
        '          </li>',
        '          <li>',
        '            <span>Inputs</span>',
        '',
        '            <ul class="lvl-3">',
        '              <li><a href="/components/inputs/input-text/">Input Text</a></li>',
        '              <li><a href="/components/inputs/textarea/">Textarea</a></li>',
        '            </ul>',
        '          </li>',
        '        </ul>',
        '      </nav>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const textarea = await readOutput('components/inputs/textarea/index.html');
    expect(textarea).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Textarea</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="main">',
        '      <nav aria-label="main">',
        '        <ul class="lvl-2">',
        '          <li>',
        '            <span>Content</span>',
        '',
        '            <ul class="lvl-3">',
        '              <li>',
        '                <details>',
        '                  <summary>Accordion</summary>',
        '                  <ul class="lvl-4">',
        '                    <li><a href="/components/content/accordion/overview/">Overview</a></li>',
        '                    <li><a href="/components/content/accordion/api/">API</a></li>',
        '                  </ul>',
        '                </details>',
        '              </li>',
        '            </ul>',
        '          </li>',
        '          <li class="web-menu-active">',
        '            <span>Inputs</span>',
        '',
        '            <ul class="lvl-3">',
        '              <li><a href="/components/inputs/input-text/">Input Text</a></li>',
        '              <li class="web-menu-current">',
        '                <a href="/components/inputs/textarea/" aria-current="page">Textarea</a>',
        '              </li>',
        '            </ul>',
        '          </li>',
        '        </ul>',
        '      </nav>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const installCli = await readOutput('getting-started/setup/install-cli/index.html');
    expect(installCli).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Install Cli</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="main">',
        '      <nav aria-label="main">',
        '        <ul class="lvl-2">',
        '          <li class="web-menu-active">',
        '            <span>Setup</span>',
        '',
        '            <ul class="lvl-3">',
        '              <li class="web-menu-current">',
        '                <a href="/getting-started/setup/install-cli/" aria-current="page">Install Cli</a>',
        '              </li>',
        '            </ul>',
        '          </li>',
        '        </ul>',
        '      </nav>',
        '    </web-menu>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );
  });

  it('tableOfContents', async () => {
    const { readOutput } = await executeCli(
      { docsDir: 'fixtures/preset-tableOfContents' },
      { captureLog: true },
    );

    const toc = await readOutput('index.html');
    expect(toc).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Welcome to the toc preset | My Page</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="table-of-contents"',
        '      ><aside>',
        '        <h2>Contents</h2>',
        '        <nav aria-label="Table of Contents">',
        '          <ol class="lvl-2">',
        '            <li>',
        '              <a href="#every-headline">Every headline</a>',
        '              <ol class="lvl-3">',
        '                <li><a href="#will-be">will be</a></li>',
        '              </ol>',
        '            </li>',
        '            <li>',
        '              <a href="#listed">listed</a>',
        '              <ol class="lvl-3">',
        '                <li>',
        '                  <a href="#considering">considering</a>',
        '                  <ol class="lvl-4">',
        '                    <li><a href="#nesting">nesting</a></li>',
        '                    <li><a href="#and">and</a></li>',
        '                  </ol>',
        '                </li>',
        '                <li><a href="#returning">returning</a></li>',
        '              </ol>',
        '            </li>',
        '            <li><a href="#to-the">to the</a></li>',
        '            <li><a href="#main-level">main level</a></li>',
        '          </ol>',
        '        </nav>',
        '      </aside></web-menu',
        '    >',
        '    <main>',
        '      <h1 id="welcome-to-the-table-of-contents-preset">Welcome to the table of contents preset</h1>',
        '      <h2 id="every-headline">Every headline</h2>',
        '      <h3 id="will-be">will be</h3>',
        '      <h2 id="listed">listed</h2>',
        '      <h3 id="considering">considering</h3>',
        '      <h4 id="nesting">nesting</h4>',
        '      <h4 id="and">and</h4>',
        '      <h3 id="returning">returning</h3>',
        '      <h2 id="to-the">to the</h2>',
        '      <h2 id="main-level">main level</h2>',
        '    </main>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const empty = await readOutput('empty/index.html');
    expect(empty).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Welcome to the toc preset | My Page</title>',
        '  </head>',
        '  <body>',
        '    <web-menu preset="table-of-contents"></web-menu>',
        '    <main>',
        '      <h1>Empty because no sub headlines</h1>',
        '      <h2>or no ids</h2>',
        '    </main>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );
  });
});
