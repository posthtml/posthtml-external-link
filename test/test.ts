import 'ts-mocha';
import chai from 'chai';
chai.should();

import posthtml from 'posthtml';
import { posthtmlExternalLink as plugin } from '../src';

describe('posthtml-external-link', () => {
  context('plugin option', () => {
    it('no option provided', async () => {
      const fixture = '<a href="https://example.com/">Example</a>';
      const { html: result } = await posthtml([plugin()]).process(fixture);
      const expected = '<a href="https://example.com/">Example</a>';

      return result.should.eql(expected);
    });

    it('option.exclude - string', async () => {
      const { html: result } = await posthtml([plugin({ exclude: 'skk.moe' })]).process('<a href="https://example.com/">Example</a>');

      result.should.include('" rel="noopener nofollow external"');
      result.should.include('" target="_blank"');
    });

    it('options.exlude - array', async () => {
      const { html: result } = await posthtml([plugin({ exclude: ['skk.moe'] })]).process('<a href="https://example.com/">Example</a>');

      result.should.include('" rel="noopener nofollow external"');
      result.should.include('" target="_blank"');
    });
  });

  context('external link processing', () => {
    it('ignore link without href', async () => {
      const fixture = '<a>Example</a>';
      const { html: result } = await posthtml([plugin({ exclude: ['skk.moe'] })]).process(fixture);
      const expected = fixture;

      result.should.eql(expected);
    });

    it('relative path', async () => {
      const fixture = '<a href="/path/to/example">Example</a>';
      const { html: result } = await posthtml([plugin({ exclude: ['skk.moe'] })]).process(fixture);
      const expected = fixture;

      result.should.eql(expected);
    });

    it('invalid url', async () => {
      const fixture = '<a href="http://localhost:4000测试">Example</a>';
      const { html: result } = await posthtml([plugin({ exclude: ['skk.moe'] })]).process(fixture);
      const expected = fixture;

      result.should.eql(expected);
    });

    it('internal url', async () => {
      const fixtures = [
        '<a href="http://skk.moe">Example</a>',
        '<a href="https://skk.moe">Example</a>',
        '<a href="//skk.moe">Example</a>',
        '<a href="#test">Example</a>'
      ];

      const results = await Promise.all(fixtures.map(fixture => posthtml([plugin({ exclude: ['skk.moe'] })]).process(fixture)));

      results[0].html.should.eql(fixtures[0]);
      results[1].html.should.eql(fixtures[1]);
      results[2].html.should.eql(fixtures[2]);
      results[3].html.should.eql(fixtures[3]);
    });

    it('rel attr', async () => {
      const { html: result } = await posthtml([plugin({ exclude: ['skk.moe'] })]).process('<a href="https://example.com/" rel="example">Example</a>');

      result.should.include('" rel="example noopener nofollow external"');
      result.should.include('" target="_blank"');
    });

    it('adds noreferrer when config is set', async () => {
      const parser = posthtml([plugin({
        exclude: ['skk.moe'],
        noreferrer: true
      })]);

      const input = '<a href="https://example.com" rel="example">Example</a>';
      const { html: result } = await parser.process(input);

      result.should.include(' rel="example noreferrer noopener nofollow external"')
    })

    it('adds noreferrer even to elements without an existing [rel]', async () => {
      const parser = posthtml([plugin({
        exclude: ['skk.moe'],
        noreferrer: true
      })])

      const input = '<a href="https://example.com">Example</a>';
      const { html: result } = await parser.process(input);

      result.should.include(' rel="noreferrer noopener nofollow external"')
    })

    it('target attr', async () => {
      const { html: result } = await posthtml([plugin({ exclude: ['skk.moe'] })]).process('<a href="https://example.com/" target="_self">Example</a>');

      result.should.include('" target="_blank"');
      result.should.not.include('_self');
    });
  });
});
