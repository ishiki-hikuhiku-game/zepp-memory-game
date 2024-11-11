#!/bin/sh

for f in *.aiff;do
  ffmpeg -i $f -vn -ac 2 -ar 44100 -ab 256k -acodec libmp3lame -f mp3 -ss 0.4 -t 1 -af volume=36dB ${f%.*}.mp3
done

cp *.mp3 ../assets/gt.r/sounds/
cp *.mp3 ../assets/gt.s/sounds/