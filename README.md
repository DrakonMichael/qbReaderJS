# qbreaderJS
A small program I wrote over the span of two days that can help with studying, use this is you want to study using more up-to-date packets. (Requires a digital copy of a packet to read.)

Insert PDF packet files into the "QuestionDirectory" folder inside of the file, after that, shift right click inside of the folder and run it inside. This requires node to be installed on your device.

A sample PACE NSC packet is included. This program does not read bonuses, only tossups.

Please report any bugs to me directly at mpkarpov@gmail.com.

----------------------------------------------------------------------------------------

This product is licenced under an MIT liscence, so feel free to distribute, edit, and basically do whatever you want with it. However, whenever redistributing this program, make sure to copy the licence as well.

To launch the program, simply run the command "node reader.js", and it will gather data from the packet and read questions to you.

to buzz in, simply press space, and the question will stop being read. after that you may enter your answer and press the enter key, after which aceakash's (https://www.npmjs.com/~aceakash) string-similarity algorithm will determine the "closeness" of the answer.

The running score is listed in the top-right, and NAQT rules for powers and negs are used.

Have fun quizbowling.
