# 发送邮箱html编写(无法执行script脚本)

```java
"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
                "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" +
                "　<head>\n" +
                "    　　<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n" +
                "    　　<title>HTML Email编写指南</title>\n" +
                "    　　<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n" +
                "   <style>\n" +
                "     body,html{\n" +
                "       width:100%;\n" +
                "       background:#eee;\n" +
                "     }\n" +
                "     .email-box{\n" +
                "       width:640px;\n" +
                "       height:430px;\n" +
                "       margin:0 auto;\n" +
                "       background:#fff;\n" +
                "       padding: 40px 50px;\n" +
                "       box-sizing:border-box;\n" +
                "     }\n" +
                "     .line{\n" +
                "       width:100%;\n" +
                "       height:1px;\n" +
                "       background:#DCDDDE;\n" +
                "       margin-bottom:20px;\n" +
                "     }\n" +
                "     .btn{\n" +
                "         display:block;\n" +
                "         width:fit-content;\n" +
                "         padding: 15px 19px;\n" +
                "         text-align:center;\n" +
                "         color: #fff;\n" +
                "         background:rgb(88,101,242);\n" +
                "         border-radius:5px;\n" +
                "         text-decoration:none !important;\n" +
                "         margin:50px auto;\n" +
                "     }\n" +
                "     .first{\n" +
                "       font-size:20px;\n" +
                "       font-weight:500;\n" +
                "       margin: 0.8em 0;\n" +
                "       color:#4F545C;\n" +
                "     }\n" +
                "     .second,.third{\n" +
                "        font-size: 16px;\n" +
                "        color:#737F8D;\n" +
                "        line-height:170%;\n" +
                "     }\n" +
                "     .third{\n" +
                "        font-size: 14px;\n" +
                "        word-break: break-all;\n" +
                "     }\n" +
                "   </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"email-box\">\n" +
                "    <div class=\"first\">Hello，Aider：</div>\n" +
                "    <div class=\"second\">欢迎注册AidLux智能物联网开发和部署平台开发者社区，您正在进行邮箱验证。点击下方的按钮以验证电子邮箱:</div>\n" +
                "    <a id=\"go\" class=\"btn\" href=\"http://192.168.110.39:8888/api/v1/profile/mail/bind?accessToken=" +EncryptUtil.encryptWithMD5(String.valueOf(userId)) + "\" >验证邮箱地址</a>\n" +
                "    <div class=\"line\"></div>\n" +
                "    <div class=\"third\" id=\"third\">如果网页没有正常打开，您也可以复制下方链接至浏览器打开完成验证。<br />链接:192.168.110.39:8888/api/v1/profile/mail/bind?accessToken="+EncryptUtil.encryptWithMD5(String.valueOf(userId))+"</div>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>"
```

