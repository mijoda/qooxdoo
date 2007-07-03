/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

   ======================================================================

   This class contains code based on the following work:

   * Yahoo! UI Library
       http://developer.yahoo.com/yui
       Version 2.2.0

     Copyright:
       (c) 2007, Yahoo! Inc.

     License:
       BSD: http://developer.yahoo.com/yui/license.txt


************************************************************************ */

/* ************************************************************************

#module(html2)

************************************************************************ */

/**
 * Includes library functions to work with the client's document.
 *
 */
qx.Class.define("qx.html2.Document",
{
  statics :
  {
    /**
     * Returns the width of the document.
     *
     * @type static
     * @return {Integer} The width of the actual document (which includes the body and its margin).
     */
    getWidth : qx.lang.Object.select(qx.html2.client.Features.STANDARD_MODE ? "standard" : "quirks",
    {
      "standard" : function() {
        return Math.max(document.documentElement.scrollWidth, qx.html2.Viewport.getWidth());
      },

      "quirks" : function() {
        return Math.max(document.body.scrollWidth, qx.html2.Viewport.getWidth());
      }
    }),


    /**
     * Returns the height of the document.
     *
     * @type static
     * @return {Integer} The height of the actual document (which includes the body and its margin).
     */
    getHeight : qx.lang.Object.select(qx.html2.client.Features.STANDARD_MODE ? "standard" : "quirks",
    {
      "standard" : function() {
        return Math.max(document.documentElement.scrollHeight, qx.html2.Viewport.getHeight());
      },

      "quirks" : function() {
        return Math.max(document.body.scrollHeight, qx.html2.Viewport.getHeight());
      }
    })
  }
});
