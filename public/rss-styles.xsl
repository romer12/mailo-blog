<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> - RSS Feed</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
            color: #333;
          }
          .header {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
          }
          h1 {
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
          }
          .description {
            opacity: 0.9;
            font-size: 1.1rem;
          }
          .info {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .item {
            background: white;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s;
          }
          .item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .item-title {
            font-size: 1.3rem;
            margin: 0 0 0.5rem 0;
          }
          .item-title a {
            color: #6366f1;
            text-decoration: none;
          }
          .item-title a:hover {
            text-decoration: underline;
          }
          .item-date {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }
          .item-description {
            color: #555;
            line-height: 1.6;
          }
          .subscribe-info {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
        </div>
        
        <div class="subscribe-info">
          <strong>📡 这是一个 RSS Feed</strong>
          <p>将此页面的 URL 复制到你的 RSS 阅读器中以订阅更新。</p>
        </div>
        
        <div class="info">
          <p><strong>最后更新:</strong> <xsl:value-of select="/rss/channel/lastBuildDate"/></p>
          <p><strong>文章数量:</strong> <xsl:value-of select="count(/rss/channel/item)"/></p>
        </div>
        
        <xsl:for-each select="/rss/channel/item">
          <div class="item">
            <h2 class="item-title">
              <a href="{link}">
                <xsl:value-of select="title"/>
              </a>
            </h2>
            <div class="item-date">
              <xsl:value-of select="pubDate"/>
            </div>
            <div class="item-description">
              <xsl:value-of select="description"/>
            </div>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
