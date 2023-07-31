const { execSync } = require('child_process');
const markdownIt = require('markdown-it');
const anchor = require('markdown-it-anchor');
const pluginTOC = require('eleventy-plugin-toc');
const slugify = require('slugify');

console.log(`

You can visit documentation on: 
 
    🌐 http://localhost:10082/documentation
    🌐 http://localhost:10082/en/modules/documentation
    🌐 http://localhost:8085/
 
`);

module.exports = function (eleventyConfig) {
  // See: https://github.com/markdown-it/markdown-it
  const markdownItOptions = {
    html: true,
  };

  // See: https://github.com/valeriangalliat/markdown-it-anchor
  const markdownItAnchorOptions = {
    permalink: anchor.permalink.linkAfterHeader({
      style: 'visually-hidden',
      assistiveText: (title) => title,
      visuallyHiddenClass: 'visually-hidden',
      wrapper: ['<div class="title-wrapper">', '</div>'],
      symbol: `<span data-kind="anchor-link">🔗</span>`,
      placement: 'after',
      class: 'anchor-link',
    }),
    // We must remove exotic chars from hashes
    slugify: (s) => {
      return slugify(s, { strict: true });
    },
  };

  eleventyConfig.setLibrary('md', markdownIt(markdownItOptions).use(anchor, markdownItAnchorOptions));

  eleventyConfig.addPlugin(pluginTOC, { wrapper: 'div' });

  // When watching, after each build we copy results to server
  eleventyConfig.on('eleventy.after', async ({ dir, results, runMode, outputMode }) => {
    if (['watch', 'serve'].includes(runMode)) {
      execSync('./node_modules/.bin/ts-node ./scripts/package.ts', { shell: true, stdio: 'inherit' });
    }
  });

  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/**/*.js');
  eleventyConfig.addPassthroughCopy('src/**/*.mp4');
  eleventyConfig.addPassthroughCopy('src/**/*.png');
  eleventyConfig.addPassthroughCopy('src/**/*.jpg');
  eleventyConfig.addPassthroughCopy('src/**/*.gif');
  eleventyConfig.addPassthroughCopy('node_modules/i18next/dist/umd/i18next.min.js');

  eleventyConfig.addGlobalData('ABC_VERSION', execSync('git rev-parse HEAD').toString('utf-8').substring(0, 20));

  return {
    pathPrefix: '/documentation',
    dir: {
      // DO NOT use underscores at the beginning of folder names, otherwise fastify-static will not serve it
      input: 'src',
      output: 'build',
      includes: 'layouts',
    },
  };
};
