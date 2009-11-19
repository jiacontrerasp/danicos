<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output 
  method="html"
  encoding="ISO-8859-1"
  doctype-public="-//W3C//DTD HTML 4.01//EN"
  doctype-system="http://www.w3.org/TR/html4/strict.dtd"
  indent="yes" />
  
<xsl:template match="//eyeReportResults">
  <html>
  <head>
  	<style type="text/css">
  		body {
  			font-family: Verdana;
  		}
  		table{
  			border-spacing:1px;
  			font:10px 'Verdana', Arial, Helvetica, sans-serif;
  			background:#E7E7E7;
  			color:#666666;
  		}
		caption{
			border:#666666;
			border-bottom:2px solid #666666;
			text-transform:uppercase;
			padding:10px;
			font:15px 'Verdana', Arial, Helvetica, sans-serif;
			font-style:italic;
			font-weight:bold;
		}
		td, th{padding:4px;}
		thead th{
			text-align:center;
			background:#F5F5F5;
			color:#666666;
			border:1px solid #ffffff;
			text-transform:uppercase;
		}
		tbody th{font-weight:bold;}
		tbody tr{background:#EBF8FE;text-align:left;}
		tbody tr.odd{background:#ffffff;border-top:1px solid #ffffff;}
		tbody th a:hover{color:#009900;}
		tbody tr td{height:50px;border:1px solid #ffffff;}
		tbody tr.even td{background:#EBF8FE;border-top:1px solid #ffffff;}
		tbody tr.odd td{background:#ffffff;border-top:1px solid #ffffff;}
		table td a:link, table td a:visited{color:#666666;text-decoration:none;font-weight: bold;}
		table td a:hover{color:#009900;text-decoration:underline;font-weight: bold;}
  	</style>
  </head>
  
  <body>
    <p class="title">eyeReport</p>
      <table>
		<xsl:apply-templates select="//result" mode="answer" />
      </table>
  </body></html>
</xsl:template>



<xsl:template match="result" mode="header">
	<tr class="header">
		<th>#</th>
		<th>User</th>
		<xsl:for-each select="//result[position() = 1]//question/id">
			<th>
				<xsl:value-of select="." />
			</th>
		</xsl:for-each>
   	</tr>
</xsl:template>

<xsl:template match="result" mode="answer">
  	<!-- Repeat columns headers every 20 lines -->
  	<xsl:if test="position() mod 20 = 1">
  		<xsl:apply-templates select="." mode="header" />
  	</xsl:if>
  	
  	<!-- Alternate lines background color -->
  	<xsl:choose>
  		<xsl:when test="position() mod 2 = 0">
		  	<tr class="even">
		  		<td>
		   			<xsl:value-of select="position()"/>
		   		</td>
		   		<td>
		   			<xsl:value-of select="user" />
		   		</td>
		   		<xsl:apply-templates select="question" />
		   	</tr>
		</xsl:when>
		<xsl:otherwise>
			<tr class="odd">
		  		<td>
		   			<xsl:value-of select="position()"/>
		   		</td>
		   		<td>
		   			<xsl:value-of select="user" />
		   		</td>
		   		<xsl:apply-templates select="question" />
		   	</tr>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="question">
	<td>
		<xsl:value-of select="answer" />
	</td>
</xsl:template>

</xsl:stylesheet>