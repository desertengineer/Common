<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" id="stylesheet" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
  <html>
  <body>
    <xsl:for-each select="SFLProjectsGallery/Project">
    <div class="{Classes}"> 
        <a href="javascript:void(0);" id="{Id}" onclick="displayProject(this)"> 
            <img src="{Img}"/> 
            <h3><xsl:value-of select="Name"/></h3>
        </a>
        <p><xsl:value-of select="Location"/></p>
      </div>
    </xsl:for-each>
 </body> 
  </html>
</xsl:template>
</xsl:stylesheet>
