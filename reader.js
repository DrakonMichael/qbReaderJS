const fs = require('fs')
const parsePdf = require('parse-pdf')
const chalk = require('chalk')
const delay = require('delay')
const ss = require('string-similarity')

var pause = false
var quickFinish = false
var page = 1
var looktossup = 1
var seeTossup = 1
var tossup = 1
var devmode = false
var currentlyReading = false
var version = chalk.yellow("v1.0.0")
var readingdoc = false
var writtentext = ""
var readinginPower = false
var writinganswer = true
var scorethreshhold = 0.6
var canProtest = false
var prostesting = false
var RunningScore = 0



var qbReader = `    #                     #              ##  ###   
### ###     ### ###  ## ### ### ###       #  # 
# # # #     #   ##  # # # # ##  #         #  ###  
### ###     #   ### ### ### ### #       # #    #
  #                                      #   ###   `



const readline = require('readline');

(async () => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {

        if (canProtest == true) {
            if (key.name == "p") {
                prostesting = true
            }
        }

      if (key.ctrl && key.name === 'c') {
        process.exit();
      } else {

        if (pause) {
            if (key.name == "backspace") {
                writtentext = writtentext.slice(0,-1)
            } else if (key.name == "return") {
                 pause = false
                quickFinish = true
            } else {
                writtentext = writtentext + key.sequence
            }


        } else {
            if (key.name == "space") {
                 pause = true
            } 
        }

       

        

      }
    });

})();


var spacer = "\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n"
var tossupbar = "\n[-----------------------------------------]\n"


function adjustAlgoritm(ansRes,resultingsimilarity) {
    var oldthreshhold = scorethreshhold
    scorethreshhold = scorethreshhold + (ansRes*Math.abs(resultingsimilarity-scorethreshhold)/2)
    if (scorethreshhold<0.2) {
        scorethreshhold = 0.2
    }

    return [oldthreshhold,scorethreshhold]
}

async function ReadFile(dir) {
  try {
    var parsed = await parsePdf(fs.readFileSync(dir))
   

    var File = parsed.pages





		


      
      while (page<=File.length) {
      t = LookForTossups(File[page-1].text)
      
     // console.log(File[page-1].text)
      while (tossup<=t.length) {
        if (currentlyReading == false) {
           // console.log(tossup.toString())
             ReadTossup(t[tossup-1])
            
            }
            await delay(50)
           

        }

        await delay(200)
        page++
        tossup = 1

        

       }


        

        console.log("\n\n\n\n")
        console.log(chalk.bold("The end of the source has been reached, continuing with new source"))
        console.log("\n\n" + chalk.bold.yellow(qbReader)+"\n\n"+version)
        await delay(500)
        readingdoc = false
    
  } catch(e) {
    console.log(error(e)); // 30
    process.exit()
  }
}

function ReadTossup(arr) {


        (async () => {
        currentlyReading = true
        powerText = arr[0]
        tentext = arr[1]
        answer = arr[2]


		i = 0
        readinginPower = true
        isReading = true
    	while (i < powerText.split(" ").length) {
            if (quickFinish) {
                break
            }

         timeoutlen = 0.05 + powerText.split(" ")[i].split("").length*0.025
        	wordlist = powerText.split(" ")

        	j = 0
        	textShow = ""
        	while (j < i) {
        		textShow = textShow + wordlist[j] + " "
        		j++
        	}
               
        		if (pause==false) {
                      await delay(timeoutlen*10)
         	          console.log(chalk.dim(spacer + chalk.bold("Score: ") + chalk.bold.green(RunningScore.toString()) + "\n\n" + chalk.underline("Tossup " + seeTossup.toString()) + tossupbar + "\n" + chalk.bold(textShow)))
                      await delay(timeoutlen*1000)
                      i++
                } else {
                await delay(100)
                 console.log(chalk.dim(spacer + chalk.bold("Score: ") + chalk.bold.green(RunningScore.toString()) + "\n\n" + chalk.underline("Tossup " + seeTossup.toString()) + tossupbar) + "\n" +chalk.bold(textShow)+"\n"+tossupbar+"\n\n"+writtentext)
                await delay(50)
             }
             
            
                
    		
    	}
		

        i = 0
        
        while (i < tentext.split(" ").length) {
            if (quickFinish) {
                break
            }
            readinginPower = false
            wordlist = tentext.split(" ")

            j = 0
            textShow = ""
            while (j < i) {
                textShow = textShow + wordlist[j] + " "
                j++
            }
            timeoutlen = 0.05 + tentext.split(" ")[i].split("").length*0.025
            
            if (pause==false) {
               await delay(timeoutlen*10)
                console.log(chalk.dim(spacer + chalk.bold("Score: ") + chalk.bold.green(RunningScore.toString()) + "\n\n" +  chalk.underline("Tossup " + seeTossup.toString() + tossupbar) + "\n" + chalk.bold(powerText) + chalk.grey(textShow)))
                await delay(timeoutlen*1000)
                i++
            } else {
                await delay(200)
                 console.log(chalk.dim(spacer + chalk.bold("Score: ") + chalk.bold.green(RunningScore.toString()) + "\n\n" +  chalk.underline("Tossup " + seeTossup.toString()) + tossupbar) + "\n" + chalk.bold(powerText) + chalk.grey(textShow)+tossupbar+"\n\n"+writtentext)
                await delay(timeoutlen*1000)
            }

            await delay(timeoutlen*10)
           


            
        }
        if (quickFinish == false) {
            isReading = false
        }

        var correctstr = ""
        var comparescore = ss.compareTwoStrings(getanswers(answer), writtentext)
        if (comparescore>=scorethreshhold) {
            canProtest = true
            if (readinginPower) {
                RunningScore = RunningScore + 15
                correctstr = chalk.bgGreen(" Correct ") + chalk.cyan.bold(" [+15] ") +chalk.magenta("    [Press P to Protest]")
            } else {
                RunningScore = RunningScore + 10
                correctstr = chalk.bgGreen(" Correct ") + chalk.green.bold(" [+10] ") +chalk.magenta("    [Press P to Protest]")
            }
        } else {
            
            if (isReading == true) {
                canProtest = true
                correctstr = chalk.bgYellow(" Incorrect ") + chalk.red.bold(" [-5] ") +chalk.magenta("    [Press P to Protest]")
                RunningScore = RunningScore - 5
            } else {
                correctstr = chalk.bgRed(" No Answer Given ") + chalk.grey.dim(" [0] ") +chalk.magenta("    [Press P to Protest]")
            }

        }

        if (quickFinish == true) {
            quickFinish = false
            console.log(chalk.dim(spacer + chalk.bold("Score: ") + chalk.bold.green(RunningScore.toString()) + "\n\n" +  chalk.underline("Tossup " + seeTossup.toString()) + tossupbar + "\n" + chalk.bold(powerText) + chalk.grey(tentext)))
            console.log(chalk.dim(tossupbar + "\n"))
            console.log(writtentext + "   " + correctstr + "\n\n" + chalk.inverse(answer))
            await delay(5000)
        } else {
            console.log(chalk.dim(tossupbar + "\n"))
            await delay(3000)
        	console.log(writtentext + "   " + correctstr + "\n\n" + chalk.inverse(answer))
            await delay(5000)
        }

        canProtest = false
        if (prostesting) {
            prostesting = false

            if (comparescore >= scorethreshhold) {
                datatable = adjustAlgoritm(1,comparescore)
            } else {
                datatable = adjustAlgoritm(-1,comparescore)
            }
            
            console.log(chalk.bold.yellow("\n>-----------------<" + "\n\nThank you for telling me that the algorithm is terrible, it has been adjusted accordingly.\n\n" + datatable[0] + " => " + datatable[1] + "\n\n" + ">-----------------<"))
            await delay(3000)
        }
        
        

        writtentext = ""
        tossup = tossup + 1
        seeTossup = seeTossup+1
        currentlyReading = false

    })();

    	

}

function getanswers(text) {
    var textarr = text.split("")

    var index = 0
    var answer = ""
    var breakloop = false
    
    while (index<textarr.length && breakloop == false) {
        if (textarr[index] == "[" || textarr[index] == "(" || textarr[index] == "<") {
            breakloop = true
        } else {
            if (breakloop == false) {
            answer = answer + textarr[index]
            }
        }
        index++
    }

    return answer.substring(9)
}

function LookForTossups(text) {

	word = 0
	arr = text.split(" ")
	returnarr = []
	lookingforTossup = false
	currentTossup = [" "," "," "]
	power = true
	answer = false
	while (word < arr.length) {
		
		if (lookingforTossup == true) {
			if (arr[word] == "ANSWER:" || arr[word] == "ANSWER:​") {
				answer = true
			}


			if (arr[word] == "(*)" || arr[word] == "(*)​") {
				power = false
			}

			if (arr[word] == (looktossup+1).toString() + "." || arr[word] == "Page") {
				lookingforTossup = true
				returnarr.push(currentTossup)
				looktossup++
				currentTossup = [" "," "," "]
				power = true
                answer = false
			} else {
				
				if (answer == false) {
					if (power == true) {
						currentTossup[0] = currentTossup[0] + arr[word] + " "
					} else {
						currentTossup[1] = currentTossup[1] + arr[word] + " "
					}	

				} else {
					currentTossup[2] = currentTossup[2] + arr[word] + " "
				}
		
			
			}

		} else {
			if (arr[word] == looktossup.toString() + ".") {
				lookingforTossup = true
				power = true
			}
		}
		word++
	}


	return returnarr
}

function error(text) {
    return chalk.red(chalk.bold("[!] An error has occured: ") + text)
}

var dir = fs.readdirSync('./QuestionDirectory/');

(async () => {



    if (dir.length > 0) {

        if (devmode == false) {
            console.log(spacer+ chalk.bold.yellow(qbReader)+"\n\n"+version)
             await delay(1000)
            for(i=1;i<12+1;i++) {
                console.log()
                await delay(50)
            }
            await delay(2000)
            console.log(chalk.underline("Michael Karpov (c) 2018 || Free use under MIT license \n" + chalk.bold("https://github.com/DrakonMichael/qbReaderJS")))
            await delay(3000)
            console.log(chalk.bold("Please wait for the program to finish loading."))
            await delay(3000)
            console.log(chalk.bold(spacer + "Questions have been loaded from the following source: "))
            console.log(chalk.inverse(dir))
            await delay(2000)
            console.log(chalk.bold(spacer + "Tossup one will begin in \n \n 3"))
            await delay(1000)
            console.log(chalk.bold(spacer + "Tossup one will begin in \n \n 2"))
            await delay(1000)
            console.log(chalk.bold(spacer + "Tossup one will begin in \n \n 1"))
            await delay(1000)
         }

        while (true) {
            if (readingdoc==false) {
                var doc = Math.floor(Math.random()*dir.length)

                ReadFile("./QuestionDirectory/"+dir[doc])
                readingdoc =true
              }
              await delay(1500)
        }
    } else {
        console.log(spacer + error("Question directory is empty, please insert files into /QuestionDirectory/"))
        process.exit()
    }
})();






