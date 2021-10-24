import chai from 'chai';
import { setupTestEngine } from './test-helpers.js';

const { expect } = chai;

describe('Engine watch', () => {
  it.skip('rerenders only a single file when changing a single file', async () => {
    const { execute, readOutput, writeSource, watch, cleanup } = setupTestEngine(
      'fixtures/09-watch/edit-single-page/docs',
    );

    await writeSource('index.rocket.js', "export default 'index';");
    await writeSource('about.rocket.js', "export default 'about';");
    await execute();
    expect(readOutput('index.html')).to.equal('<my-layout>index</my-layout>');
    expect(readOutput('about/index.html')).to.equal('<my-layout>about</my-layout>');

    watch();
    await writeSource('index.rocket.js', "export default 'updated index';");
    await new Promise(resolve => setTimeout(resolve, 1000)); // TODO: add an await afterNextRender() test helper
    expect(readOutput('index.html')).to.equal('<my-layout>updated index</my-layout>');

    await cleanup();
  });
});
