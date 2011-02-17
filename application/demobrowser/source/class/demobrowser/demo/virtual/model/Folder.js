/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */
qx.Class.define("demobrowser.demo.virtual.model.Folder",
{
  extend : demobrowser.demo.virtual.model.File,

  construct : function(name, children)
  {
    this.base(arguments, name);

    if (children == null) {
      children = [];
    }
    this.setChildren(children);
  },
      
  properties :
  {
    children :
    {
      check : "Array",
      event : "changeChildren",
      nullable : true
    }
  },
  
  destruct : function()
  {
    if (!qx.core.ObjectRegistry.inShutDown)
    {
      var children = this.getChildren();
      for (var i = 0; i  < children.length; i++) {
        children[i].dispose();
      }
      this.setChildren(null);
    }
  }
});
