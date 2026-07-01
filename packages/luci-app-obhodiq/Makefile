include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-obhodiq
PKG_VERSION:=0.1.0
PKG_RELEASE:=2

PKG_LICENSE:=GPL-2.0-or-later
PKG_MAINTAINER:=Local
PKG_BUILD_DEPENDS:=

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-obhodiq
	SECTION:=luci
	CATEGORY:=LuCI
	SUBMENU:=3. Applications
	TITLE:=LuCI app for Obhodiq
	DEPENDS:=+luci-base +obhodiq
	PKGARCH:=all
endef

define Package/luci-app-obhodiq/description
	LuCI UI for the Obhodiq subscription manager.
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/luci-app-obhodiq/install
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/obhodiq
	$(INSTALL_DATA) ./htdocs/luci-static/resources/view/obhodiq/main.js $(1)/www/luci-static/resources/view/obhodiq/main.js
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./root/usr/share/luci/menu.d/luci-app-obhodiq.json $(1)/usr/share/luci/menu.d/luci-app-obhodiq.json
endef

define Package/luci-app-obhodiq/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] && exit 0
rm -f /usr/share/luci/menu.d/luci-app-obhodiq.json
rm -rf /www/luci-static/resources/view/obhodiq
exit 0
endef

$(eval $(call BuildPackage,luci-app-obhodiq))
