var markdown2html = require('markdown').parse
  , html2wiki = require('wiky').toWiki

function markdown2wiki(input) {
  return html2wiki(markdown2html(input)).
    // `x`    ->    <tt>x</tt>
    replace(/%([^%]*)%/g, '<tt>$1<\/tt>').
    // <code>x</code>   ->    <source>x</source>
    replace(/<([\/]*)code>/g, '<$1source>').
    // *x*    ->    <strong>x</strong>
    replace(/\*([^\*]*)\*/g, '<strong>$1</strong>').
    // <li> -> *
    replace(/<li>/g, '* ').
    // <p>x</p>   ->    x
    replace(/<p[^>]*>/g, '').
    //
    replace(/<\/source><\/tt>\]/g, '</source>').
    replace(/\[<tt><source>/g, '<source>')//.
    //replace(/_([^_]*)_/g, '<emphasis>$1</emphasis>')
}
exports.markdown2wiki = markdown2wiki

function wiki2markdown(input) {
}
exports.wiki2markdown = wiki2markdown
