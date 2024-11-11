import { log as Logger } from "@zos/utils";
import AutoGUI from "@silver-zepp/autogui";
const gui = new AutoGUI();

// just a test (doesn't work on the Simulator yet)
import { SoundPlayer } from "../../../include/libs/easy-media"
// actual sound object (to use with a physical device)
// const sound = new SoundPlayer("click.mp3", true);
// dummy object (to use on a simulator)
// const sound = { play: function() {}, destroy: function() {} }; 
const soundFilenames = [
  "sounds/Piano.pp.C4.mp3",
  "sounds/Piano.pp.Eb4.mp3",
  "sounds/Piano.pp.F4.mp3",
  "sounds/Piano.pp.G4.mp3",
  "sounds/Piano.pp.Bb4.mp3",
  "sounds/Piano.pp.C5.mp3",
]
// It seems to crash when creating many SoundPlayer instances.
const sound = new SoundPlayer(soundFilenames[0], true);
// I'm not sure how to check the logs.
const logger = Logger.getLogger("helloworld");

const colorButtons = [];

const generatePattern = () => Math.floor(Math.random() * colorButtons.length);

/**
 * pattern of automatic performance.
 */
let pattern = [];

const initPattern = () => {
  pattern = [generatePattern()];
}

initPattern();

const nextPattern = () => {
  pattern.push(generatePattern());
}

let autoPlaying = false;
let playing = false;
let index = 0;
let startButton;

const fillPressableRect = (color, activeColor, soundIndex) => {
  const widget = gui.fillRect(color);
  
  const onPress = () => {
    sound.changeFile(soundFilenames[soundIndex]);
    sound.play();
    widget.update({color: activeColor});
    setTimeout(() => {
      widget.update({color: color});
    }, 100);
  };
  widget.onPress(() => {
    if (playing) {
      if (pattern[index] === colorButtons.indexOf(widget)) {
        index++;
        if (index === pattern.length) {
          playing = false;
          nextPattern();
          startButton.update({ text: `Next: ${pattern.length}!` });
        }
      } else {
        sound.changeFile("sounds/wrong.mp3");
        sound.play();
        playing = false;
        initPattern();
        startButton.update({ text: "Start!" });
        return;
      }
    } else if (autoPlaying) {
      return;
    }
    onPress();
  });
  widget.onPressCallback = onPress;
  colorButtons.push(widget);
  return widget;
}


const autoplay = () => {
  if (autoPlaying || playing) {
    return;
  }
  startButton.update({ text: "now playing..." });
  autoPlaying = true;
  let i = 0;
  const next = () => {
    if (i < pattern.length) {
      const colorButton = colorButtons[pattern[i]];
      colorButton.onPressCallback();
      i++;
      setTimeout(next, 1000);
    } else {
      index = 0;
      autoPlaying = false;
      playing = true;
      startButton.update({ text: "Let's replay!" });
    }
  }
  next();
}

Page({
  onInit() {
    logger.debug("page onInit invoked");
  },
  build() {
    logger.debug("page build invoked");
    
    // If you display it all the way to the top, it will overlap with the automatically displayed header.
    // I'm not sure how to hide the header or display the UI without overlapping the header.
    // So, create a 3-line UI and leave the first line blank.
    gui.spacer();
    // Adding a line divides the screen into equal parts vertically.
    gui.newRow();
    // When you add UI, the rows are distributed horizontally.
    // I'm not sure how to arrange the UI more freely.
    fillPressableRect(0xbb0000, 0xff0000, 0);
    fillPressableRect(0x00bb00, 0x00ff00, 1);
    fillPressableRect(0x0000bb, 0x0000ff, 2);
    gui.newRow();
    fillPressableRect(0x00bbbb, 0x00ffff, 3);
    fillPressableRect(0xbb00bb, 0xff00ff, 4);
    fillPressableRect(0xbbbb00, 0xffff00, 5);
    gui.newRow();
    startButton = gui.button("Start!", () => {
      if (!autoPlaying) {
        autoplay();
      }
    });

    gui.render();
    initPattern();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
    sound.destroy();
  },
});
