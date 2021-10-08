import chai from 'chai';
import { expectThrowsAsync, setupTestEngine } from './test-helpers.js';

const { expect } = chai;

describe('Layouts', () => {
  it('Basic', async () => {
    const { execute, readOutput } = setupTestEngine('fixtures/04-layouts/01-basic/docs');
    await execute();

    let outcome = [
      '<html>',
      '  <head>',
      '    <title>[[ web-menu-title ]] | Rocket</title>',
      '  </head>',
      '  <body>',
      '    <h1 id="welcome-members">',
      '      <a aria-hidden="true" tabindex="-1" href="#welcome-members"',
      '        ><span class="icon icon-link"></span></a',
      '      >Welcome Members:',
      '    </h1>',
      '    <ul>',
      '      <li>',
      '        <p>Superman</p>',
      '      </li>',
      '      <li>',
      '        <p>Deadpool</p>',
      '      </li>',
      '    </ul>',
      '    <p>Generated on 2022-03-03 13:20</p>',
      '    <web-menu type="main"></web-menu>',
      '  </body>',
      '</html>',
      '',
    ].join('\n');

    const index = await readOutput('index.html', { format: 'html' });
    expect(index).to.equal(outcome);

    const md = await readOutput('markdown/index.html', { format: 'html' });
    expect(md).to.equal(outcome);
  });

  it.skip('permalink-invalid-filename', async () => {
    await expectThrowsAsync(
      () => {
        const { execute } = setupTestEngine('fixtures/permalink-invalid-filename/docs');
        return execute();
      },
      {
        errorMatch: /File at ".*" is using invalid characters. Use only url safe characters like \[a-z\]\[A-Z\]-_/,
      },
    );
  });
});
