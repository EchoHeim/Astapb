### <center> <font size=34 face="STKaiti"> 字节流到字符串的转换 </font>    <!-- {docsify-ignore} -->

# 1. 字节流转换为十六进制字符串  

``` C++
void ByteToHexStr(const unsigned char* source, char* dest, int Length)  
{  
    int i;  
    unsigned char highByte, lowByte;  
  
    for (i = 0; i < Length; i++)  
    {  
        highByte = source[i] >> 4;  
        lowByte = source[i] & 0x0f ;  
  
        highByte += 0x30;  
  
        if (highByte > 0x39)  
                dest[i * 2] = highByte + 0x07;  
        else  
                dest[i * 2] = highByte;  
  
        lowByte += 0x30;  
        if (lowByte > 0x39)  
            dest[i * 2 + 1] = lowByte + 0x07;  
        else  
            dest[i * 2 + 1] = lowByte;  
    }  
    return ;  
}
```

# 2. 字节流转换为十六进制字符串的另一种实现方式  

``` C++
void Hex2Str( const char *sSrc,  char *sDest, int length )  
{  
    int  i;  
    char szTmp[3];  
  
    for( i = 0; i < length; i++ )  
    {  
        sprintf( szTmp, "%02X", (unsigned char) sSrc[i] );  
        memcpy( &sDest[i * 2], szTmp, 2 );  
    }  
    return ;  
}  
```

# 3. 十六进制字符串转换为字节流

``` C++
void HexStrToByte(const char* source, unsigned char* dest, int length)  
{  
    short i;  
    unsigned char highByte, lowByte;  
      
    for (i = 0; i < length; i += 2)  
    {  
        highByte = toupper(source[i]);  
        lowByte  = toupper(source[i + 1]);  
  
        if (highByte > 0x39)  
            highByte -= 0x37;  
        else  
            highByte -= 0x30;  
  
        if (lowByte > 0x39)  
            lowByte -= 0x37;  
        else  
            lowByte -= 0x30;  
  
        dest[i / 2] = (highByte << 4) | lowByte;  
    }  
    return ;  
}  
```
