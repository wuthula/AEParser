AEParser (v.1.1)
----------------

Adobe After Effects can export video tracking points so you can use them anyway you want. The problem is that the points are exported in a legible text format, so if you want to use them in any programming language they are useless. This JS simply parses the text and converts it into a useful JSON. 


Usage
-----

You just have to make a call to AEParser.parse with all the After Effects text as a unique parameter. The result is the json Object.

The example uses JSON.stringify to output the json, so it may not work in old versions of IE and maybe other ancient browsers.



Example After Effects Text:
---------------------------
