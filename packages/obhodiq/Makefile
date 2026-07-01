include $(TOPDIR)/rules.mk

PKG_NAME:=obhodiq
PKG_VERSION:=0.1.0
PKG_RELEASE:=2

PKG_MAINTAINER:=Local
PKG_LICENSE:=GPL-2.0-or-later

include $(INCLUDE_DIR)/package.mk

define Package/obhodiq
	SECTION:=net
	CATEGORY:=Network
	DEPENDS:=+podkop +curl +jq +coreutils-base64
	TITLE:=Obhodiq subscription manager for Podkop
	PKGARCH:=all
endef

define Package/obhodiq/description
	Subscription parsing, filtering, latency checks, and Podkop sync layer.
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/obhodiq/conffiles
/etc/config/obhodiq
endef

define Package/obhodiq/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./files/etc/config/obhodiq $(1)/etc/config/obhodiq

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/etc/init.d/obhodiq $(1)/etc/init.d/obhodiq

	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./files/usr/bin/obhodiq $(1)/usr/bin/obhodiq

	$(INSTALL_DIR) $(1)/usr/lib/obhodiq
	$(CP) ./files/usr/lib/obhodiq/* $(1)/usr/lib/obhodiq/

	$(INSTALL_DIR) $(1)/www/cgi-bin
	$(INSTALL_BIN) ./files/www/cgi-bin/obhodiq $(1)/www/cgi-bin/obhodiq
endef

define Package/obhodiq/postinst
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] && exit 0
mkdir -p /etc/obhodiq /var/run/obhodiq
/etc/init.d/obhodiq enable >/dev/null 2>&1 || true
/etc/init.d/obhodiq restart >/dev/null 2>&1 || true
exit 0
endef

define Package/obhodiq/prerm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] && exit 0
/usr/bin/obhodiq set-update-schedule never >/dev/null 2>&1 || true
/etc/init.d/obhodiq stop >/dev/null 2>&1 || true
/etc/init.d/obhodiq disable >/dev/null 2>&1 || true
exit 0
endef

define Package/obhodiq/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] && exit 0
rm -rf /etc/obhodiq /var/run/obhodiq
rm -f /tmp/obhodiq-auto-update.log
rm -f /etc/config/obhodiq /etc/init.d/obhodiq /usr/bin/obhodiq /www/cgi-bin/obhodiq
rm -rf /usr/lib/obhodiq
exit 0
endef

$(eval $(call BuildPackage,obhodiq))
