---
title: "WiFi 芯片 RTL8821CS，Rockchip RV1109 平台系统软重启后不能正常工作"
published: 2025-03-09
tags:
- WiFi
- Rockchip
category: 嵌入式
draft: false			# true=草稿不显示，false=公开
pinned: false		# true=置顶
image: 
---

## 问题
Rockchip RV1109 平台，系统软重启后，WiFi 模块不能正常工作；断电重启后，WiFi 模块正常。

## Rockchip 回复
RTL8821CS&nbsp;这颗模块比较特别，&nbsp;由于模块CHIP_EN&nbsp;没有引出来，reboot 时断电不完全。所以 RK 参考设计是有用单独 gpio 控电 vbat，这个要看你们硬件设计，是否预留相应 gpio。可打下面补丁进行控制。  
```
diff --git a/arch/arm64/boot/dts/rockchip/rk3399-sapphire.dtsi b/arch/arm64/boot/dts/rockchip/rk3399-sapphire.dtsi

index a4076b888f7d..1bd289e2b4bc 100644

--- a/arch/arm64/boot/dts/rockchip/rk3399-sapphire.dtsi

+++ b/arch/arm64/boot/dts/rockchip/rk3399-sapphire.dtsi

@@ -100,7 +100,7 @@

         clocks = &lt;&amp;rk808 1&gt;;

         clock-names = "ext_clock";

         pinctrl-names = "default";

-        pinctrl-0 = &lt;&amp;wifi_enable_h&gt;;

+        pinctrl-0 = &lt;&amp;wifi_enable_h &amp;wifi_poweren_h&gt;;

         /*

          * On the module itself this is one of these (depending

@@ -109,6 +109,7 @@

          * - PDN (power down when low)

          */

         reset-gpios = &lt;&amp;gpio0 10 GPIO_ACTIVE_LOW&gt;; /* GPIO0_B2 */

+        poweren-gpios = &lt;&amp;gpio0 8 GPIO_ACTIVE_LOW&gt;; /* GPIO0_B2 */

     };

     vcc3v3_sys: vcc3v3-sys {

@@ -731,4 +732,14 @@

             rockchip,pins = &lt;1 2 RK_FUNC_GPIO &amp;pcfg_pull_up&gt;;

         };

     };

+

+     sdio-pwrseq {

+                wifi_enable_h: wifi-enable-h {

+                        rockchip,pins = &lt;0 RK_PB2 RK_FUNC_GPIO &amp;pcfg_pull_none&gt;;

+                };

+               

+                wifi_poweren_h: wifi-poweren-h {

+                        rockchip,pins = &lt;0 RK_PB0 RK_FUNC_GPIO &amp;pcfg_pull_up&gt;;

+                };

+     };

};

--- a/drivers/mmc/core/pwrseq_simple.c

+++ b/drivers/mmc/core/pwrseq_simple.c

@@ -14,6 +14,7 @@

#include &lt;linux/err.h&gt;

#include &lt;linux/of_gpio.h&gt;

#include &lt;linux/gpio/consumer.h&gt;

+#include &lt;linux/delay.h&gt;

#include &lt;linux/mmc/host.h&gt;

@@ -24,12 +25,27 @@ struct mmc_pwrseq_simple {

        bool clk_enabled;

        struct clk *ext_clk;

        struct gpio_descs *reset_gpios;

+       struct gpio_descs *poweren_gpios;

};

static void mmc_pwrseq_simple_set_gpios_value(struct mmc_pwrseq_simple *pwrseq,
                                              int value)
{
        struct gpio_descs *reset_gpios = pwrseq-&gt;reset_gpios;

+       struct gpio_descs *poweren_gpios = pwrseq-&gt;poweren_gpios;

+

+       if (!IS_ERR(poweren_gpios)) {

+               int i;

+               int values&#91;poweren_gpios-&gt;ndescs];

+

+               for (i = 0; i &lt; poweren_gpios-&gt;ndescs; i++)

+                       values&#91;i] = value;

+

+               gpiod_set_array_value_cansleep(

+                       poweren_gpios-&gt;ndescs, poweren_gpios-&gt;desc, values);

+       }

+

+       msleep(200); //200ms

        if (!IS_ERR(reset_gpios)) {

                int i;

@@ -41,6 +57,7 @@ static void mmc_pwrseq_simple_set_gpios_value(struct mmc_pwrseq_simple *pwrseq,

                gpiod_set_array_value_cansleep(

                        reset_gpios-&gt;ndescs, reset_gpios-&gt;desc, values);
        }

+

}

static void mmc_pwrseq_simple_pre_power_on(struct mmc_host *host)

@@ -122,6 +139,14 @@ struct mmc_pwrseq *mmc_pwrseq_simple_alloc(struct mmc_host *host,

                ret = PTR_ERR(pwrseq-&gt;reset_gpios);

                goto clk_put;

        }
+

+               pwrseq-&gt;poweren_gpios = gpiod_get_array(dev, "poweren", GPIOD_OUT_HIGH);

+       if (IS_ERR(pwrseq-&gt;poweren_gpios) &amp;&amp;

+           PTR_ERR(pwrseq-&gt;poweren_gpios) != -ENOENT &amp;&amp;

+           PTR_ERR(pwrseq-&gt;poweren_gpios) != -ENOSYS) {

+               ret = PTR_ERR(pwrseq-&gt;poweren_gpios);

+               //goto clk_put;

+       }
```

## 说明
官方给出的回复是 RK3399 平台的修改代码，RV1109 平台可以参考修改 dtsi 文件。  
