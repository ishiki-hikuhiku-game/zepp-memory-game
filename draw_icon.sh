#!/bin/sh
# アイコンをimagemagickで生成するためのスクリプト


convert -size 248x248 "xc:transparent"  -alpha set -background none -channel RGBA \
     -fill "#444444" -draw "circle 124,124 244, 124" \
     -fill red -draw  "rectangle 45,45 120, 120" \
     -fill green -draw  "rectangle 128,45 203, 120" \
     -fill cyan -draw  "rectangle 45,128 120, 203" \
     -fill magenta -draw  "rectangle 128,128 203, 203" \
     icon.png

cp icon.png assets/icon.png
cp icon.png assets/gt.r/icon.png
cp icon.png assets/gt.s/icon.png

rm icon.png