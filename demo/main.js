
'use strict'

var markdown2wiki = require('markdown-wiki').markdown2wiki
,   wiki2html = require('wiky').toHtml

,   xsltProcessor = null
,   parser = new DOMParser()
,   serializer = new XMLSerializer()
,   template =
    [ '<?xml version="1.0"?>'
    , '<html xmlns="http://www.w3.org/1999/xhtml">'
    , '<body>'
    , '{{body}}'
    , '</body>'
    , '</html>'
    ].join('\n')

function html2markdown(html) {
  if (xsltProcessor) {
    try {
      html = template.replace('{{body}}', html)
      var xml = parser.parseFromString(html,"text/xml")
      var transformed = xsltProcessor.transformToDocument(xml)
      markdown = transformed.documentElement.children[1].children[0].textContent.
        replace(/<tt>([^<]*)<\/tt>/g, '`$1`')
      //var markdown = serializer.serializeToString(transformed.documentElement.childNodes[2])
      return markdown
    } catch(e) {
      return e.message
    }
  }
  return "Loading ..."
}

function main() {
  var stdin = document.getElementById("stdin")
  var stdout = document.getElementById("stdout")
  var request = new XMLHttpRequest()
  request.open('GET', 'resources/markdown.xsl', true)
  request.onreadystatechange = function() {
    request.overrideMimeType('text/xml')
    if (request.readyState = 4 && (request.status == 0 || request.status == 200)) {
      xsltProcessor = new XSLTProcessor()
      xsltProcessor.importStylesheet(request.responseXML)
    }
  }
  request.send(null)

  document.documentElement.addEventListener("keyup", function(e) {
    if (e.target == stdin) stdout.value = markdown2wiki(stdin.value)
    if (e.target == stdout) stdin.value = html2markdown(wiki2html(stdout.value))
  }, true);
}

if (require.main == module) {
  if ('complete' === document.readyState) main()
  else window.addEventListener("load", main, false)
}

