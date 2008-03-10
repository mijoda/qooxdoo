/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * This class maintains a list of all widgets, which need an update of their
 * decoration. All decoration changes can then be done at once.
 */
qx.Class.define("qx.ui.core.DecorationQueue",
{
  statics :
  {
    /** {Map} This contains all the queued widgets for the next flush. */
    __queue : {},


    /**
     * Mark a widget's decoration as invalid and add it to the queue.
     *
     * Should only be used by {@link qx.ui.core.Widget}.
     *
     * @type static
     * @param widget {qx.ui.core.Widget} Widget to add.
     * @return {void}
     */
    add : function(widget)
    {
      this.__queue[widget.$$hash] = widget;
      qx.ui.core.QueueManager.scheduleFlush("decoration");
    },


    /**
     * Mark a widget's decoration as valid and remove it from the queue.
     *
     * Should only be used by {@link qx.ui.core.Widget}.
     *
     * @type static
     * @param widget {qx.ui.core.Widget} Widget to remove.
     * @return {void}
     */
    remove : function(widget) {
      delete this.__queue[widget.$$hash];
    },


    /**
     * Update the decoration of all widgets from the decoration queue.
     *
     * This is used exclusively by the {@link qx.ui.core.QueueManager}.
     *
     * @type static
     * @return {void}
     */
    flush : function()
    {
      for (var widgetHash in this.__queue)
      {
        var widget = this.__queue[widgetHash];
        if (widget)
        {
          var size = widget.getComputedLayout();
          if (size) {
            widget.updateDecoration(size.width, size.height);
          }
        }
      }

      if (widget) {
        this.__queue = {};
      }
    }
  }
});
