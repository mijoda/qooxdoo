/* ************************************************************************

   qooxdoo - the new era of web interface development

   Copyright:
     (C) 2004-2006 by Schlund + Partner AG, Germany
         All rights reserved

   License:
     LGPL 2.1: http://creativecommons.org/licenses/LGPL/2.1/

   Internet:
     * http://qooxdoo.oss.schlund.de

   Authors:
     * Sebastian Werner (wpbasti)
       <sebastian dot werner at 1und1 dot de>
     * Andreas Ecker (aecker)
       <andreas dot ecker at 1und1 dot de>

************************************************************************ */

/* ************************************************************************

#package(nativewindow)
#require(QxDomWindow)
#post(qx.ui.core.ClientDocument)
#post(QxUtil)
#post(qx.client.Timer)

************************************************************************ */

qx.client.NativeWindow = function(vUrl, vName)
{
  qx.core.Target.call(this);


  // ************************************************************************
  //   TIMER
  // ************************************************************************

  this._timer = new qx.client.Timer(100);
  this._timer.addEventListener(QxConst.EVENT_TYPE_INTERVAL, this._oninterval, this);


  // ************************************************************************
  //   INITIAL PROPERTIES
  // ************************************************************************

  if (qx.util.Validation.isValidString(vUrl)) {
    this.setUrl(vUrl);
  };

  if (qx.util.Validation.isValidString(vName)) {
    this.setName(vName);
  };
};

qx.client.NativeWindow.extend(qx.core.Target, "qx.client.NativeWindow");



/*
---------------------------------------------------------------------------
  DATA
---------------------------------------------------------------------------
*/

qx.client.NativeWindow.PROPERTY_DEPENDENT = "dependent";
qx.client.NativeWindow.PROPERTY_WIDTH = "width";
qx.client.NativeWindow.PROPERTY_HEIGHT = "height";
qx.client.NativeWindow.PROPERTY_LEFT = "left";
qx.client.NativeWindow.PROPERTY_TOP = "top";
qx.client.NativeWindow.PROPERTY_RESIZABLE = "resizable";
qx.client.NativeWindow.PROPERTY_STATUS = "status";
qx.client.NativeWindow.PROPERTY_LOCATION = "location";
qx.client.NativeWindow.PROPERTY_MENUBAR = "menubar";
qx.client.NativeWindow.PROPERTY_TOOLBAR = "toolbar";
qx.client.NativeWindow.PROPERTY_SCROLLBARS = "scrollbars";
qx.client.NativeWindow.PROPERTY_MODAL = "modal";




/*
---------------------------------------------------------------------------
  PROPERTIES
---------------------------------------------------------------------------
*/

/*!
  If the window is open or closed
*/
qx.client.NativeWindow.addProperty({ name : "open", type : QxConst.TYPEOF_BOOLEAN, defaultValue : false });

/*!
  The outer width of the window.
*/
qx.client.NativeWindow.addProperty({ name : "width", type : QxConst.TYPEOF_NUMBER, defaultValue : 400, impl : "dimension" });

/*!
  The outer height of the window.
*/
qx.client.NativeWindow.addProperty({ name : "height", type : QxConst.TYPEOF_NUMBER, defaultValue : 250, impl : "dimension" });

/*!
  The left screen coordinate of the window.
*/
qx.client.NativeWindow.addProperty({ name : "left", type : QxConst.TYPEOF_NUMBER, defaultValue : 100, impl : "position" });

/*!
  The top screen coordinate of the window.
*/
qx.client.NativeWindow.addProperty({ name : "top", type : QxConst.TYPEOF_NUMBER, defaultValue : 200, impl : "position" });

/*!
  Should be window be modal
*/
qx.client.NativeWindow.addProperty({ name : "modal", type : QxConst.TYPEOF_BOOLEAN, defaultValue : false });

/*!
  Should be window be dependent on this application window
*/
qx.client.NativeWindow.addProperty({ name : "dependent", type : QxConst.TYPEOF_BOOLEAN, defaultValue : true });

/*!
  The url
*/
qx.client.NativeWindow.addProperty({ name : "url", type : QxConst.TYPEOF_STRING });

/*!
  The window name
*/
qx.client.NativeWindow.addProperty({ name : "name", type : QxConst.TYPEOF_STRING });

/*!
  The text of the statusbar
*/
qx.client.NativeWindow.addProperty({ name : "status", type : QxConst.TYPEOF_STRING, defaultValue : "Ready" });

/*!
  Should the statusbar be shown
*/
qx.client.NativeWindow.addProperty({ name : "showStatusbar", type : QxConst.TYPEOF_BOOLEAN, defaultValue : false });

/*!
  Should the menubar be shown
*/
qx.client.NativeWindow.addProperty({ name : "showMenubar", type : QxConst.TYPEOF_BOOLEAN, defaultValue : false });

/*!
  Should the location(bar) be shown
*/
qx.client.NativeWindow.addProperty({ name : "showLocation", type : QxConst.TYPEOF_BOOLEAN, defaultValue : false });

/*!
  Should the toolbar be shown
*/
qx.client.NativeWindow.addProperty({ name : "showToolbar", type : QxConst.TYPEOF_BOOLEAN, defaultValue : false });

/*!
  If the window is resizeable
*/
qx.client.NativeWindow.addProperty({ name : "resizeable", type : QxConst.TYPEOF_BOOLEAN, defaultValue : true });

/*!
  If the window is able to scroll and has visible scrollbars if needed
*/
qx.client.NativeWindow.addProperty({ name : "allowScrollbars", type : QxConst.TYPEOF_BOOLEAN, defaultValue : true });





/*
---------------------------------------------------------------------------
  PROPERTY GROUPS
---------------------------------------------------------------------------
*/

qx.client.NativeWindow.addPropertyGroup({ name : "location", members : [ "left", "top" ]});
qx.client.NativeWindow.addPropertyGroup({ name : "dimension", members : [ "width", "height" ]});




/*
---------------------------------------------------------------------------
  MODIFIERS
---------------------------------------------------------------------------
*/

proto._modifyPosition = function(propValue, propOldValue, propName)
{
  /*
    http://www.microsoft.com/technet/prodtechnol/winxppro/maintain/sp2brows.mspx
    Changes to Functionality in Microsoft Windows XP Service Pack 2
    Part 5: Enhanced Browsing Security
    URLACTION_FEATURE_WINDOW_RESTRICTIONS
    Allow script-initiated windows without size or position constraints
    Code: 2102
  */

  if (!this.isClosed())
  {
    try
    {
      this._window.moveTo(this.getLeft(), this.getTop());
    }
    catch(ex)
    {
      this.error("Cross-Domain Scripting problem: Could not move window!");
    };
  };

  return true;
};

proto._modifyDimension = function(propValue, propOldValue, propName)
{
  /*
    http://www.microsoft.com/technet/prodtechnol/winxppro/maintain/sp2brows.mspx
    Changes to Functionality in Microsoft Windows XP Service Pack 2
    Part 5: Enhanced Browsing Security
    URLACTION_FEATURE_WINDOW_RESTRICTIONS
    Allow script-initiated windows without size or position constraints
    Code: 2102
  */

  if (!this.isClosed())
  {
    try
    {
      this._window.resizeTo(this.getWidth(), this.getHeight());
    }
    catch(ex)
    {
      this.error("Cross-Domain Scripting problem: Could not resize window!");
    };
  };

  return true;
};

proto._modifyName = function(propValue, propOldValue, propName)
{
  if (!this.isClosed()) {
    this._window.name = propValue;
  };

  return true;
};

proto._modifyUrl = function(propValue, propOldValue, propName)
{
  // String hack needed for old compressor (compile.py)
  if(!this.isClosed()) {
    this._window.location.replace(qx.util.Validation.isValidString(propValue) ? propValue : ("javascript:/" + "/"));
  };

  return true;
};

proto._modifyOpen = function(propValue, propOldValue, propData)
{
  propValue ? this._open() : this._close();
  return true;
};






/*
---------------------------------------------------------------------------
  NAME
---------------------------------------------------------------------------
*/

proto.getName = function()
{
  if (!this.isClosed())
  {
    try
    {
      var vName = this._window.name;
    }
    catch(ex)
    {
      return this._valueName;
    };

    if (vName == this._valueName)
    {
      return vName;
    }
    else
    {
      throw new Error("window name and name property are not identical");
    };
  }
  else
  {
    return this._valueName;
  };
};






/*
---------------------------------------------------------------------------
  UTILITY
---------------------------------------------------------------------------
*/

proto.isClosed = function()
{
  var vClosed = true;

  if (this._window)
  {
    try {
      vClosed = this._window.closed;
    } catch(ex) {};
  };

  return vClosed;
};

proto.open = function() {
  this.setOpen(true);
};

proto.close = function() {
  this.setOpen(false);
};









/*
---------------------------------------------------------------------------
  OPEN METHOD
---------------------------------------------------------------------------
*/

proto._open = function()
{
  var vConf = [];


  /*
  ------------------------------------------------------------------------------
    PRE CONFIGURE WINDOW
  ------------------------------------------------------------------------------
  */

  if (qx.util.Validation.isValidNumber(this.getWidth()))
  {
    vConf.push(qx.client.NativeWindow.PROPERTY_WIDTH);
    vConf.push(QxConst.CORE_EQUAL);
    vConf.push(this.getWidth());
    vConf.push(QxConst.CORE_COMMA);
  };

  if (qx.util.Validation.isValidNumber(this.getHeight()))
  {
    vConf.push(qx.client.NativeWindow.PROPERTY_HEIGHT);
    vConf.push(QxConst.CORE_EQUAL);
    vConf.push(this.getHeight());
    vConf.push(QxConst.CORE_COMMA);
  };

  if (qx.util.Validation.isValidNumber(this.getLeft()))
  {
    vConf.push(qx.client.NativeWindow.PROPERTY_LEFT);
    vConf.push(QxConst.CORE_EQUAL);
    vConf.push(this.getLeft());
    vConf.push(QxConst.CORE_COMMA);
  };

  if (qx.util.Validation.isValidNumber(this.getTop()))
  {
    vConf.push(qx.client.NativeWindow.PROPERTY_TOP);
    vConf.push(QxConst.CORE_EQUAL);
    vConf.push(this.getTop());
    vConf.push(QxConst.CORE_COMMA);
  };



  vConf.push(qx.client.NativeWindow.PROPERTY_DEPENDENT);
  vConf.push(QxConst.CORE_EQUAL);
  vConf.push(this.getDependent() ? QxConst.CORE_YES : QxConst.CORE_NO);
  vConf.push(QxConst.CORE_COMMA);

  vConf.push(qx.client.NativeWindow.PROPERTY_RESIZABLE);
  vConf.push(QxConst.CORE_EQUAL);
  vConf.push(this.getResizeable() ? QxConst.CORE_YES : QxConst.CORE_NO);
  vConf.push(QxConst.CORE_COMMA);

  vConf.push(qx.client.NativeWindow.PROPERTY_STATUS);
  vConf.push(QxConst.CORE_EQUAL);
  vConf.push(this.getShowStatusbar() ? QxConst.CORE_YES : QxConst.CORE_NO);
  vConf.push(QxConst.CORE_COMMA);

  vConf.push(qx.client.NativeWindow.PROPERTY_LOCATION);
  vConf.push(QxConst.CORE_EQUAL);
  vConf.push(this.getShowLocation() ? QxConst.CORE_YES : QxConst.CORE_NO);
  vConf.push(QxConst.CORE_COMMA);

  vConf.push(qx.client.NativeWindow.PROPERTY_MENUBAR);
  vConf.push(QxConst.CORE_EQUAL);
  vConf.push(this.getShowMenubar() ? QxConst.CORE_YES : QxConst.CORE_NO);
  vConf.push(QxConst.CORE_COMMA);

  vConf.push(qx.client.NativeWindow.PROPERTY_TOOLBAR);
  vConf.push(QxConst.CORE_EQUAL);
  vConf.push(this.getShowToolbar() ? QxConst.CORE_YES : QxConst.CORE_NO);
  vConf.push(QxConst.CORE_COMMA);

  vConf.push(qx.client.NativeWindow.PROPERTY_SCROLLBARS);
  vConf.push(QxConst.CORE_EQUAL);
  vConf.push(this.getAllowScrollbars() ? QxConst.CORE_YES : QxConst.CORE_NO);
  vConf.push(QxConst.CORE_COMMA);

  vConf.push(qx.client.NativeWindow.PROPERTY_MODAL);
  vConf.push(QxConst.CORE_EQUAL);
  vConf.push(this.getModal() ? QxConst.CORE_YES : QxConst.CORE_NO);
  vConf.push(QxConst.CORE_COMMA);






  /*
  ------------------------------------------------------------------------------
    OPEN WINDOW
  ------------------------------------------------------------------------------
  */

  if (qx.util.Validation.isInvalidString(this.getName())) {
    this.setName(this.classname + this.toHashCode());
  };

  this._window = window.open(this.getUrl(), this.getName(), vConf.join(QxConst.CORE_EMPTY));

  if (this.isClosed())
  {
    this.error("Window could not be opened. It seems, there is a popup blocker active!", "_open");
  }
  else
  {
    // start timer for close detection
    this._timer.start();

    // block original document
    if (this.getModal())
    {
      var vClientWindow = window.application.getClientWindow();

      if (vClientWindow) {
        vClientWindow.getClientDocument().block(this);
      };
    };
  };
};

proto._close = function()
{
  if (!this._window) {
    return;
  };

  // stop timer for close detection
  this._timer.stop();

  // release window again
  if (this.getModal())
  {
    var vClientWindow = window.application.getClientWindow();

    if (vClientWindow) {
      vClientWindow.getClientDocument().release(this);
    };
  };

  // finally close window
  if (!this.isClosed()) {
    this._window.close();
  };
};






/*
---------------------------------------------------------------------------
  CENTER SUPPORT
---------------------------------------------------------------------------
*/

proto.centerToScreen = function() {
  return this._centerHelper((screen.width - this.getWidth()) / 2, (screen.height - this.getHeight()) / 2);
};

proto.centerToScreenArea = function() {
  return this._centerHelper((screen.availWidth - this.getWidth()) / 2, (screen.availHeight - this.getHeight()) / 2);
};

proto.centerToOpener = function() {
  return this._centerHelper(((qx.dom.DomWindow.getInnerWidth(window) - this.getWidth()) / 2) + qx.dom.DomLocation.getScreenBoxLeft(window.document.body), ((qx.dom.DomWindow.getInnerHeight(window) - this.getHeight()) / 2) + qx.dom.DomLocation.getScreenBoxTop(window.document.body));
};

proto._centerHelper = function(l, t)
{
  // set new values
  this.setLeft(l);
  this.setTop(t);

  // focus window if opened
  if (!this.isClosed()) {
    this.focus();
  };
};






/*
---------------------------------------------------------------------------
  FOCUS HANDLING
---------------------------------------------------------------------------
*/

proto.focus = function()
{
  if (!this.isClosed()) {
    this._window.focus();
  };
};

proto.blur = function()
{
  if (!this.isClosed()) {
    this._window.blur();
  };
};







/*
---------------------------------------------------------------------------
  EVENT HANDLING
---------------------------------------------------------------------------
*/

proto._oninterval = function(e)
{
  if (this.isClosed()) {
    this.setOpen(false);
  };
};






/*
---------------------------------------------------------------------------
  DISPOSER
---------------------------------------------------------------------------
*/

proto.dispose = function()
{
  if (this.getDisposed()) {
    return;
  };

  if (this.getDependent()) {
    this.close();
  };

  if (this._timer)
  {
    this._timer.stop();
    this._timer = null;
  };

  this._window = null;

  return qx.core.Target.prototype.dispose.call(this);
};
