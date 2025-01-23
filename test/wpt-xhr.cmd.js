/**
 * @module  wpt-xhr-cmd
 * @desc    The wpt-xhr command line interface module.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/** Import nodeJS core modules */
import process from 'node:process';

/** @const {object} cmdOptions - Command line options */
const cmdOptions = {
	host    : 'wpt.live',        // -h --host <host>
	port    : '',                // -p --port <port>
	path    : '/xhr/resources/', //    --path <path>
	url     : 'http://wpt.live/xhr/resources/',

	node   : true,               // -n --node {boolean} / -d --def {boolean}
	verbose: false,              // -v --verbose {boolean}
};

export default cmdOptions;

const CMD = 'wpt-xhr';
const CMD_VER = 'v1.0.0';

/**
 *     function main
 * function parseCmdLine()
 * function getHelp()
 * function getError(n)
 *
 * @func Main
 * @desc The application entry point function
 */
(() => {
    parseCmdLine();
    if(
		process.env.WPT_XHR_TEST &&
		(
			process.env.WPT_XHR_TEST.toLowerCase() === 'node' ||
			process.env.WPT_XHR_TEST.toLowerCase() === 'default'
		)
	){
		process.stdout.write(JSON.stringify(cmdOptions));
    }
})('Main Function');

/**
 * function main()
 *     function parseCmdLine()
 * function getHelp()
 * function getError(n)
 *
 * @func parseCmdLine
 * @desc Command line parser function
 */
function parseCmdLine(){

	const args = process.argv;

	for(let i = 2; i < args.length; i++){
		if(args[i] === '--help' || args[i] === '-h'){
			process.stdout.write(`${getHelp()}\n`);
			process.exit(0);
		}
		else
		if(args[i] === '--version'){
			process.stdout.write(`${CMD_VER}\n`);
			process.exit(0);
		}
		else
		if(args[i].startsWith('--host=')){
			let str = args[i].replace('--host=', '');

			if(!str){
				process.stderr.write(`${getError(0).replace('_', '--host')}\n`);
				process.exit(1);
			}
			else
			if(str.startsWith('-')){
				process.stderr.write(`${getError(1).replace('_', str).replace('_', '--host')}\n`);
				process.exit(1);
			}
			else{
				let url = new URL(cmdOptions.url);
				url.hostname = str;
				cmdOptions.url = url.href;
				cmdOptions.host = url.hostname;
			}
		}
		else
		if(args[i].startsWith('--port=')){
			let str = args[i].replace('--port=', '');

			if(!str){
				process.stderr.write(`${getError(0).replace('_', '--port')}\n`);
				process.exit(1);
			}
			else
			if(str.startsWith('-')){
				process.stderr.write(`${getError(1).replace('_', str).replace('_', '--port')}\n`);
				process.exit(1);
			}
			else{
				let url = new URL(cmdOptions.url);
				url.port = str;
				cmdOptions.url = url.href;
				cmdOptions.port = url.port;
			}
		}
		else
		if(args[i].startsWith('--path=')){
			let str = args[i].replace('--path=', '');

			if(!str){
				process.stderr.write(`${getError(0).replace('_', '--path')}\n`);
				process.exit(1);
			}
			else
			if(str.startsWith('/')){
				let url = new URL(cmdOptions.url);
				url.pathname = str;
				cmdOptions.url = url.href;
				cmdOptions.path = url.pathname;
			}
			else{
				process.stderr.write(`${getError(1).replace('_', str).replace('_', '--path')}\n`);
				process.exit(1);
			}
		}
		else
		if(args[i] === '--host' || args[i] === '-t'){
			if(i === args.length - 1){
				process.stderr.write(`${getError(0).replace('_', args[i])}\n`);
				process.exit(1);
			}
			else
			if(args[i + 1].startsWith('-')){
				process.stderr.write(`${getError(1).replace('_', args[i+1]).replace('_', args[i])}\n`);
				process.exit(1);
			}
			else{
				let url = new URL(cmdOptions.url);
				url.hostname = args[++i];
				cmdOptions.url = url.href;
				cmdOptions.host = url.hostname;
			}
		}
		else
		if(args[i] === '--port' || args[i] === '-p'){
			if(i === args.length - 1){
				process.stderr.write(`${getError(0).replace('_', args[i])}\n`);
				process.exit(1);
			}
			else
			if(args[i + 1].startsWith('-')){
				process.stderr.write(`${getError(1).replace('_', args[i+1]).replace('_', args[i])}\n`);
				process.exit(1);
			}
			else{
				let url = new URL(cmdOptions.url);
				url.port = args[++i];
				cmdOptions.url = url.href;
				cmdOptions.port = url.port;
			}
		}
		else
		if(args[i] === '--path'){
			if(i === args.length - 1){
				process.stderr.write(`${getError(0).replace('_', args[i])}\n`);
				process.exit(1);
			}
			else
			if(args[i+1].startsWith('/')){
				let url = new URL(cmdOptions.url);
				url.pathname = args[++i];
				cmdOptions.url = url.href;
				cmdOptions.path = url.pathname;
			}
			else{
				process.stderr.write(`${getError(1).replace('_', args[i+1]).replace('_', args[i])}\n`);
				process.exit(1);
			}
		}
		else
		if(args[i] === '-v' || args[i] === '--verbose'){
			cmdOptions.verbose = true;
		}
		else
		if(args[i] === '-n' || args[i] === '--node'){
			cmdOptions.node = true;
		}
		else
		if(args[i] === '-d' || args[i] === '--def'){
			cmdOptions.node = false;
		}
		else
		if(args[i].startsWith('--')){
			process.stderr.write(`${getError(3).replace('_', args[i].substr(2))}\n`);
			process.exit(1);
		}
		else
		if(args[i].startsWith('-')){
			process.stderr.write(`${getError(2).replace('_', args[i])}\n`);
			process.exit(1);
		}
		else{
			try{
				let url = new URL(args[i]);
				cmdOptions.url = url.href;
				cmdOptions.host = url.hostname;
				cmdOptions.port = url.port;
				cmdOptions.path = url.pathname;
			}
			catch(e){
				process.stderr.write(`${getError(4).replace('_', args[i])}\n`);
				process.exit(1);
			}
		}
	}
}

/**
 * function main
 * function parseCmdLine()
 *     function getHelp()
 * function getError(n)
 *
 * @func   getHelp
 * @return {string} Help information
 * @desc   Function to return help info
 */
function getHelp(){
	return `\
Usage: wpt-xhr [OPTIONS]... [URL]

Test the developed *XMLHttpRequest* module for compliance with
WHATWG XMLHttpRequest specs using the web-platform-tests live
or locally installed server as the testing server.

With no URL, testing server is determined by the options given.

  -t, --host[=<host>]  wpt host (default wpt.live)
  -p, --port[=<port>]  wpt port (default 80)
      --path[=<path>]  wpt path (default /xhr/resources/)
  -n  --node           use nodejs test runner API if supported
  -d  --def            use default test runner
  -v  --verbose        make the testing operation more talkative
  -h  --help           display this help and exit
      --version        output version information and exit

Note that invalid host, port or path will not be accepted.

Examples:
  wpt-xhr -t wpt.local -p 8000  Means <http://wpt.local:8000/xhr/resources/>
  wpt-xhr                       Means <http://wpt.live/xhr/resources/>

web-platforms-tests online help: <https://web-platform-tests.org/>
Full documentation <https://essamatefelsherif.github.io/whatwg-xhr/>`;
}

/**
 * function main
 * function parseCmdLine()
 * function getHelp()
 *     function getError(n)
 *
 * @func   getError
 * @param  {number} Error number
 * @return {string} Error message
 * @desc   Function to return error message
 */
function getError(n){

const error = [

// error[0]
`\
${CMD}: ambiguous argument ‘’ for ‘_’
Try '${CMD} --help' for more information.`,

// error[1]
`\
${CMD}: invalid argument ‘_’ for ‘_’
Try '${CMD} --help' for more information.`,

// error[2]
`\
${CMD}: unrecognized option '_'
Try '${CMD} --help' for more information.`,

// error[3]
`\
${CMD}: invalid option -- '_'
Try '${CMD} --help' for more information.`,

// error[4]
`\
${CMD}: invalid url '_'
Try '${CMD} --help' for more information.`,
];
	return error[n];
}
