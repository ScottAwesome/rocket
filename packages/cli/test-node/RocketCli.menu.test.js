import chai from 'chai';
import chalk from 'chalk';
import { executeStart, readStartOutput, setFixtureDir } from '@rocket/cli/test-helpers';

const { expect } = chai;

describe('RocketCli Menu', () => {
  let cli;

  before(() => {
    // ignore colors in tests as most CIs won't support it
    chalk.level = 0;
    setFixtureDir(import.meta.url);
  });

  afterEach(async () => {
    if (cli?.cleanup) {
      await cli.cleanup();
    }
  });

  it('will render a menu', async () => {
    cli = await executeStart('e2e-fixtures/menu/rocket.config.js');
    const indexHtml = await readStartOutput(cli, 'index.html', {
      formatHtml: true,
    });
    expect(indexHtml).to.equal(
      [
        '<html>',
        '  <head> </head>',
        '  <body>',
        '    <nav aria-label="Header">',
        '      <a href="/components/">Components</a>',
        '      <a href="/getting-started/">Getting Started</a>',
        '      <a href="/blog/">Blog</a>',
        '    </nav>',
        '',
        '    <h1 id="menu-page">',
        '      <a aria-hidden="true" tabindex="-1" href="#menu-page"><span class="icon icon-link"></span></a',
        '      >Menu Page',
        '    </h1>',
        '  </body>',
        '</html>',
      ].join('\n'),
    );

    const accordion = await readStartOutput(cli, 'components/content/accordion/index.html', {
      formatHtml: true,
    });
    expect(accordion).to.equal(
      [
        '<html>',
        '  <head>',
        '    <meta name="menu:order" content="10" />',
        '  </head>',
        '  <body>',
        '    <nav aria-label="Header">',
        '      <a href="/components/">Components</a>',
        '      <a href="/getting-started/">Getting Started</a>',
        '      <a href="/blog/">Blog</a>',
        '    </nav>',
        '',
        '    <h1 id="accordion">',
        '      <a aria-hidden="true" tabindex="-1" href="#accordion"><span class="icon icon-link"></span></a',
        '      >Accordion',
        '    </h1>',
        '  </body>',
        '</html>',
      ].join('\n'),
    );
  });
});
